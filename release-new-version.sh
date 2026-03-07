#!/bin/bash

# Release Script for Constellize Self-Publishing
# Tags all repositories with a shared version number and updates book metadata
#
# Usage: ./release-new-version.sh <version>
# Example: ./release-new-version.sh 0.3.0

set -e

VERSION=$1
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONSTELLIZE_DIR="$(dirname "$SCRIPT_DIR")"

# Repositories to tag
REPOS=(
  "book"
  "book-builder"
  "website"
  "marketplace"
  "prompt-factory"
  "codepromptu-extracted"
)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
  echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}!${NC} $1"
}

print_error() {
  echo -e "${RED}✗${NC} $1"
}

# Validate version argument
if [ -z "$VERSION" ]; then
  echo "Usage: $0 <version>"
  echo "Example: $0 0.3.0"
  exit 1
fi

# Validate version format (semver-like)
if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  print_error "Version must be in format X.Y.Z (e.g., 0.3.0)"
  exit 1
fi

echo "=== Constellize Release v$VERSION ==="
echo ""

# Step 1: Update book metadata
echo "--- Step 1: Update book metadata ---"
METADATA_FILE="$CONSTELLIZE_DIR/book/metadata.yaml"

if [ -f "$METADATA_FILE" ]; then
  # Update edition and version in metadata.yaml
  sed -i '' "s/^edition: .*/edition: \"Author Preview v$VERSION\"/" "$METADATA_FILE"
  sed -i '' "s/^version: .*/version: \"$VERSION\"/" "$METADATA_FILE"
  print_status "Updated book/metadata.yaml"
else
  print_warning "book/metadata.yaml not found, skipping"
fi

# Also update book-builder template metadata
BB_METADATA="$CONSTELLIZE_DIR/book-builder/templates/metadata.yaml"

if [ -f "$BB_METADATA" ]; then
  sed -i '' "s/^edition: .*/edition: \"Author Preview v$VERSION\"/" "$BB_METADATA"
  sed -i '' "s/^version: .*/version: \"$VERSION\"/" "$BB_METADATA"
  print_status "Updated book-builder/templates/metadata.yaml"
else
  print_warning "book-builder/templates/metadata.yaml not found, skipping"
fi

# Step 2: Update prompt-factory package.json
echo ""
echo "--- Step 2: Update prompt-factory version ---"
PF_PACKAGE="$CONSTELLIZE_DIR/prompt-factory/package.json"

if [ -f "$PF_PACKAGE" ]; then
  # Use node to update package.json version
  node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('$PF_PACKAGE'));
    pkg.version = '$VERSION';
    fs.writeFileSync('$PF_PACKAGE', JSON.stringify(pkg, null, 2) + '\n');
  "
  print_status "Updated prompt-factory/package.json"
else
  print_warning "prompt-factory/package.json not found, skipping"
fi

# Step 3: Commit changes
echo ""
echo "--- Step 3: Commit version updates ---"

# Commit book changes
cd "$CONSTELLIZE_DIR/book"
if git diff --quiet metadata.yaml 2>/dev/null; then
  print_warning "No changes in book/metadata.yaml"
else
  git add metadata.yaml
  git commit -m "Release v$VERSION - Update book metadata"
  print_status "Committed book changes"
fi

# Commit book-builder changes
cd "$CONSTELLIZE_DIR/book-builder"
if git diff --quiet templates/metadata.yaml 2>/dev/null; then
  print_warning "No changes in book-builder/templates/metadata.yaml"
else
  git add templates/metadata.yaml
  git commit -m "Release v$VERSION - Update template metadata"
  print_status "Committed book-builder changes"
fi

# Commit prompt-factory changes
cd "$CONSTELLIZE_DIR/prompt-factory"
if git diff --quiet package.json 2>/dev/null; then
  print_warning "No changes in prompt-factory/package.json"
else
  git add package.json
  git commit -m "Release v$VERSION"
  print_status "Committed prompt-factory changes"
fi

# Step 4: Tag all repositories
echo ""
echo "--- Step 4: Tag repositories ---"

for repo in "${REPOS[@]}"; do
  REPO_DIR="$CONSTELLIZE_DIR/$repo"

  if [ -d "$REPO_DIR/.git" ]; then
    cd "$REPO_DIR"

    # Check if tag already exists
    if git rev-parse "v$VERSION" >/dev/null 2>&1; then
      print_warning "$repo: Tag v$VERSION already exists"
    else
      git tag -a "v$VERSION" -m "Release v$VERSION"
      print_status "$repo: Created tag v$VERSION"
    fi
  else
    print_warning "$repo: Not a git repository, skipping"
  fi
done

# Step 5: Push all changes and tags
echo ""
echo "--- Step 5: Push changes and tags ---"

for repo in "${REPOS[@]}"; do
  REPO_DIR="$CONSTELLIZE_DIR/$repo"

  if [ -d "$REPO_DIR/.git" ]; then
    cd "$REPO_DIR"

    # Push commits
    if git push 2>/dev/null; then
      print_status "$repo: Pushed commits"
    else
      print_warning "$repo: No commits to push or push failed"
    fi

    # Push tags
    if git push --tags 2>/dev/null; then
      print_status "$repo: Pushed tags"
    else
      print_warning "$repo: No tags to push or push failed"
    fi
  fi
done

# Step 6: Build and publish book (optional)
echo ""
echo "--- Step 6: Build and publish book ---"

read -p "Build and publish book to website? [y/N] " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  cd "$CONSTELLIZE_DIR/book"

  echo "Building all book formats..."
  npm run build:all

  echo "Publishing to website..."
  ./publish-to-website.sh "$VERSION"

  # Commit and retag website
  cd "$CONSTELLIZE_DIR/website"
  git add public/book/
  git commit -m "Publish book v$VERSION - PDF, EPUB, HTML formats"

  # Delete old tag and create new one
  git tag -d "v$VERSION" 2>/dev/null || true
  git push origin ":refs/tags/v$VERSION" 2>/dev/null || true
  git tag -a "v$VERSION" -m "Release v$VERSION with book files"
  git push
  git push --tags

  print_status "Book published to website"
fi

# Summary
echo ""
echo "=== Release v$VERSION Complete ==="
echo ""
echo "Tagged repositories:"
for repo in "${REPOS[@]}"; do
  echo "  - $repo"
done
echo ""
echo "Book metadata updated:"
echo "  edition: \"Author Preview v$VERSION\""
echo "  version: \"$VERSION\""
echo ""
echo "Book files available at:"
echo "  https://constellize.com/book/constellize-book-v$VERSION.pdf"
echo "  https://constellize.com/book/constellize-book-latest.pdf"
