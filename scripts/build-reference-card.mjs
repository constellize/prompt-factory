#!/usr/bin/env node

/**
 * Build the Constellize reference card PDFs from the factory's own copy of the infographic
 * (content/literal/marketplace-docs/); the marketplace's docs/ copy is generated from it.
 *
 * There are two cards because there are two marketplace lines:
 *   v1 -- the line the book's readers install, pinned to the `v1` branch
 *   v2 -- the unpinned line that `main` becomes
 * They differ only in the install command printed in the footer.
 *
 * Why this is a script and not "open it in a browser and print":
 *   - The card declares `@page { size: 816px 1230px }`. Chrome's `--print-to-pdf` flag and the
 *     browser print dialog both ignore that and use the default paper size, so a hand print
 *     came out US Letter and spilled onto a second page. The card shipped that way.
 *     `Page.printToPDF` with `preferCSSPageSize: true` honours it and gives exactly one page.
 *   - A hand print cannot be checked. This asserts the page count and the install command.
 *
 * No new dependencies: it drives Chrome over the DevTools Protocol using Node's native
 * WebSocket (Node >= 22).
 *
 * Usage:
 *   node scripts/build-reference-card.mjs                      # writes both into ../website/public
 *   node scripts/build-reference-card.mjs --out-dir <dir>
 *   node scripts/build-reference-card.mjs --line v1 --out <file.pdf>
 */

import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile, rm, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const SOURCE_HTML = path.join(REPO_ROOT, 'content', 'literal', 'marketplace-docs', 'constellize-skills-infographic.html');

// The command as it appears in the committed HTML. Both lines are derived from it, so a
// change to the footer that this no longer matches stops the build rather than shipping a
// card with the wrong command.
const UNPINNED = '/plugin marketplace add constellize/constellize-plugins-official';
const PINNED = `${UNPINNED}#v1`;

// Must match `@page { size: ... }` in the card's stylesheet, in CSS px.
const CARD_CSS_PX = { width: 816, height: 1230 };

// `label` is printed in the footer so two printed cards can be told apart at arm's length.
// It deliberately says "book edition" / "latest" rather than "v1" / "v2": the marketplace on
// `main` has not been released as 2.0, so printing "v2" on it would be wrong today.
const LINES = {
  v1: {
    command: PINNED,
    label: 'book edition',
    file: 'constellize-reference-card-v1.pdf',
    // The site has linked this unversioned path since June, and the book's readers are the
    // larger audience, so the old URL keeps working and serves the pinned card.
    alsoWriteAs: 'constellize-reference-card.pdf',
  },
  v2: {
    command: UNPINNED,
    label: 'latest',
    file: 'constellize-reference-card-v2.pdf',
  },
};

const CHROME_CANDIDATES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
];

function findChrome() {
  const fromEnv = process.env.CHROME_PATH;
  if (fromEnv) {
    if (!existsSync(fromEnv)) throw new Error(`CHROME_PATH does not exist: ${fromEnv}`);
    return fromEnv;
  }
  const found = CHROME_CANDIDATES.find(p => existsSync(p));
  if (!found) {
    throw new Error(
      'No Chrome or Chromium found. Set CHROME_PATH to the binary.\nLooked in:\n  ' +
        CHROME_CANDIDATES.join('\n  ')
    );
  }
  return found;
}

function parseArgs(argv) {
  const args = { outDir: null, line: null, out: null };
  for (let i = 0; i < argv.length; i++) {
    const next = () => {
      const v = argv[++i];
      if (v === undefined) throw new Error(`${argv[i - 1]} needs a value`);
      return v;
    };
    switch (argv[i]) {
      case '--out-dir': args.outDir = next(); break;
      case '--line': args.line = next(); break;
      case '--out': args.out = next(); break;
      case '--help': case '-h': args.help = true; break;
      default: throw new Error(`Unknown argument: ${argv[i]}`);
    }
  }
  if (args.line && !LINES[args.line]) {
    throw new Error(`--line must be one of ${Object.keys(LINES).join(', ')}, got "${args.line}"`);
  }
  if (args.out && !args.line) throw new Error('--out requires --line');
  return args;
}

/** Build the HTML for one line, asserting the footer command is there to replace. */
function htmlForLine(source, command, label) {
  // Match the command with optional "#v1" so the source may carry either form.
  const pattern = new RegExp(
    UNPINNED.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:#v1)?',
    'g'
  );
  const matches = source.match(pattern);
  if (!matches || matches.length !== 1) {
    throw new Error(
      `Expected exactly one install command in ${SOURCE_HTML}, found ${matches ? matches.length : 0}.\n` +
        `Looked for: ${UNPINNED} (optionally followed by #v1).\n` +
        'If the footer wording changed, update UNPINNED in this script.'
    );
  }
  return source.replace(pattern, `${command} &middot; ${label}`);
}

class Chrome {
  constructor(proc, wsUrl, userDataDir) {
    this.proc = proc;
    this.wsUrl = wsUrl;
    this.userDataDir = userDataDir;
    this.nextId = 1;
    this.pending = new Map();
  }

  static async launch() {
    const binary = findChrome();
    const userDataDir = await mkdtemp(path.join(tmpdir(), 'constellize-card-'));
    const proc = spawn(
      binary,
      [
        '--headless=new',
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check',
        '--hide-scrollbars',
        `--user-data-dir=${userDataDir}`,
        '--remote-debugging-port=0',
        'about:blank',
      ],
      { stdio: ['ignore', 'ignore', 'pipe'] }
    );

    const wsUrl = await new Promise((resolve, reject) => {
      let buffer = '';
      const timer = setTimeout(
        () => reject(new Error(`Chrome did not report a debugging endpoint.\n${buffer}`)),
        30000
      );
      proc.stderr.on('data', chunk => {
        buffer += chunk;
        const m = buffer.match(/ws:\/\/[^\s]+/);
        if (m) { clearTimeout(timer); resolve(m[0]); }
      });
      proc.on('exit', code => {
        clearTimeout(timer);
        reject(new Error(`Chrome exited with code ${code} before starting.\n${buffer}`));
      });
    });

    const chrome = new Chrome(proc, wsUrl, userDataDir);
    await chrome.connect();
    return chrome;
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    this.ws.addEventListener('message', event => {
      const msg = JSON.parse(event.data);
      const waiter = this.pending.get(msg.id);
      if (!waiter) return;
      this.pending.delete(msg.id);
      if (msg.error) waiter.reject(new Error(`${msg.error.message} (CDP)`));
      else waiter.resolve(msg.result);
    });
    await new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, { once: true });
      this.ws.addEventListener('error', () => reject(new Error('CDP socket failed')), { once: true });
    });
  }

  send(method, params = {}, sessionId) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params, sessionId }));
    });
  }

  /** Render a local HTML file to a single-page PDF, returned as a Buffer. */
  async renderToPdf(fileUrl, expectedCommand) {
    const { targetId } = await this.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await this.send('Target.attachToTarget', { targetId, flatten: true });
    try {
      await this.send('Page.enable', {}, sessionId);
      const loaded = new Promise(resolve => {
        const onMessage = event => {
          const msg = JSON.parse(event.data);
          if (msg.method === 'Page.loadEventFired' && msg.sessionId === sessionId) {
            this.ws.removeEventListener('message', onMessage);
            resolve();
          }
        };
        this.ws.addEventListener('message', onMessage);
      });
      await this.send('Page.navigate', { url: fileUrl }, sessionId);
      await loaded;
      // Webfonts arrive after load; printing before they settle changes the layout.
      await this.send(
        'Runtime.evaluate',
        { expression: 'document.fonts.ready.then(() => true)', awaitPromise: true },
        sessionId
      );
      // The card is a fixed-size page with `overflow: hidden`, so anything past the bottom is
      // silently cut. That is how the footer -- the only line carrying the install command --
      // came to be missing from the card entirely while the PDF still looked fine. Check the
      // command is present AND inside the page box before printing.
      const probe = await this.send(
        'Runtime.evaluate',
        {
          expression: `(() => {
            const footer = document.querySelector('.footer');
            if (!footer) return JSON.stringify({ ok: false, reason: 'no .footer element' });
            const box = footer.getBoundingClientRect();
            return JSON.stringify({
              ok: true,
              text: (footer.textContent || '').replace(/\\s+/g, ' ').trim(),
              bottom: box.bottom,
              pageHeight: document.body.getBoundingClientRect().height,
            });
          })()`,
          returnByValue: true,
        },
        sessionId
      );
      const probed = JSON.parse(probe.result.value);
      if (!probed.ok) {
        throw new Error(`Card layout check failed: ${probed.reason}`);
      }
      if (!probed.text.includes(expectedCommand)) {
        throw new Error(
          `The footer does not carry the expected install command.\n` +
            `  expected: ${expectedCommand}\n  footer:   ${probed.text}`
        );
      }
      if (probed.bottom > probed.pageHeight) {
        throw new Error(
          `The footer overflows the page and would be clipped: it ends at ` +
            `${Math.round(probed.bottom)}px on a ${Math.round(probed.pageHeight)}px page. ` +
            'Increase the page height in the card stylesheet, or tighten the layout.'
        );
      }

      const { data } = await this.send(
        'Page.printToPDF',
        {
          printBackground: true,
          preferCSSPageSize: true,
          marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0,
        },
        sessionId
      );
      return Buffer.from(data, 'base64');
    } finally {
      await this.send('Target.closeTarget', { targetId }).catch(() => {});
    }
  }

  async close() {
    try { this.ws?.close(); } catch {}
    this.proc.kill();
    await rm(this.userDataDir, { recursive: true, force: true }).catch(() => {});
  }
}

/** Count pages without a PDF library: /Type /Page objects, excluding /Pages. */
function countPdfPages(buffer) {
  const text = buffer.toString('latin1');
  const matches = text.match(/\/Type\s*\/Page(?![s])/g);
  return matches ? matches.length : 0;
}

function pdfMediaBox(buffer) {
  const m = buffer.toString('latin1').match(/\/MediaBox\s*\[([^\]]*)\]/);
  return m ? m[1].trim().split(/\s+/).map(Number) : null;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(
      'Usage:\n' +
        '  node scripts/build-reference-card.mjs [--out-dir <dir>]\n' +
        '  node scripts/build-reference-card.mjs --line <v1|v2> --out <file.pdf>\n'
    );
    return;
  }

  if (!existsSync(SOURCE_HTML)) throw new Error(`Card source not found: ${SOURCE_HTML}`);
  const source = await readFile(SOURCE_HTML, 'utf-8');

  const targets = args.line
    ? [{ key: args.line, ...LINES[args.line], outPath: args.out
          ? path.resolve(args.out)
          : path.resolve(args.outDir ?? path.join(REPO_ROOT, '..', 'website', 'public'), LINES[args.line].file) }]
    : Object.entries(LINES).map(([key, def]) => ({
        key,
        ...def,
        outPath: path.resolve(args.outDir ?? path.join(REPO_ROOT, '..', 'website', 'public'), def.file),
      }));

  const scratch = await mkdtemp(path.join(tmpdir(), 'constellize-card-src-'));
  const chrome = await Chrome.launch();
  try {
    for (const target of targets) {
      const html = htmlForLine(source, target.command, target.label);
      const htmlPath = path.join(scratch, `${target.key}.html`);
      await writeFile(htmlPath, html, 'utf-8');

      const pdf = await chrome.renderToPdf(`file://${htmlPath}`, target.command);

      const pages = countPdfPages(pdf);
      if (pages !== 1) {
        throw new Error(
          `${target.file}: expected 1 page, got ${pages}. The card is a single fixed-size page; ` +
            'more than one means the CSS page size was not honoured.'
        );
      }
      // The card's CSS page is 816x1230 CSS px (CARD_CSS_PX, matching the @page rule in the
      // source HTML). A PDF MediaBox is in points (1/72in) and CSS px are 1/96in, so the
      // expected box is those sizes x 0.75 -- 612 x 922.5pt, compared with 1pt of slack
      // because Chrome rounds. Checking it catches a print that silently fell back to the
      // default paper size, which is how the card previously shipped as two US Letter pages.
      const box = pdfMediaBox(pdf);
      const expected = [CARD_CSS_PX.width * 0.75, CARD_CSS_PX.height * 0.75];
      if (!box || Math.abs(box[2] - expected[0]) > 1 || Math.abs(box[3] - expected[1]) > 1) {
        throw new Error(
          `${target.file}: expected a ${expected[0]}x${expected[1]}pt page ` +
            `(${CARD_CSS_PX.width}x${CARD_CSS_PX.height} CSS px), got ` +
            `${box ? `${box[2]}x${box[3]}pt` : 'no MediaBox'}.`
        );
      }

      await mkdir(path.dirname(target.outPath), { recursive: true });
      await writeFile(target.outPath, pdf);
      console.log(
        `✓ ${path.relative(process.cwd(), target.outPath)}  ` +
          `(${pages} page, ${Math.round(box[2])}x${Math.round(box[3])}pt, ` +
          `${(pdf.length / 1024).toFixed(0)} kB)  ${target.command}`
      );

      if (target.alsoWriteAs && !args.out) {
        const aliasPath = path.join(path.dirname(target.outPath), target.alsoWriteAs);
        await writeFile(aliasPath, pdf);
        console.log(`✓ ${path.relative(process.cwd(), aliasPath)}  (same file, kept for the existing link)`);
      }
    }
  } finally {
    await chrome.close();
    await rm(scratch, { recursive: true, force: true }).catch(() => {});
  }
}

main().catch(err => {
  console.error(`\nbuild-reference-card: ${err.message}`);
  process.exit(1);
});
