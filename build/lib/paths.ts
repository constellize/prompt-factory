/**
 * Rewrite bare memory-bank/ and construction/ path references to the llm/ layout.
 *
 * Ported from the marketplace's former scripts/migrate-paths.sh. The order of the
 * substitutions is load-bearing: placeholders protect operations-memory-bank/ and
 * already-prefixed llm/ paths from being prefixed twice.
 */
export function rewriteLlmPaths(body: string): string {
  let out = body
    .replace(/operations-memory-bank\//g, '__OPS_MEMORY_BANK_PLACEHOLDER__')
    .replace(/llm\/memory-bank\//g, '__LLM_MEMORY_BANK_PLACEHOLDER__')
    .replace(/memory-bank\//g, 'llm/memory-bank/')
    .replace(/__LLM_MEMORY_BANK_PLACEHOLDER__/g, 'llm/memory-bank/')
    .replace(/__OPS_MEMORY_BANK_PLACEHOLDER__/g, 'llm/operations-memory-bank/');

  // construction/ only when preceded by backtick, space, double quote or slash,
  // or at the start of a line (sed applies these per line).
  out = out
    .replace(/llm\/construction\//g, '__LLM_CONSTRUCTION_PLACEHOLDER__')
    .replace(/([` "/])construction\//g, '$1llm/construction/')
    .replace(/^construction\//gm, 'llm/construction/')
    .replace(/__LLM_CONSTRUCTION_PLACEHOLDER__/g, 'llm/construction/');
  return out;
}
