# CodeGraph Integration - Quick Start

## What is CodeGraph?

CodeGraph is a **local semantic code index** that:
- Indexes your entire codebase (TypeScript, JavaScript, 19+ languages)
- Creates a SQLite database of symbols, imports, and relationships
- Provides CLI tools for analysis (search, callers, impact, affected tests)
- Auto-syncs as you code (file watcher)
- **Integrates with GitHub Copilot** via `copilot-instructions.md`

## Current Status

✅ **Initialized:** `.codegraph/` directory created
✅ **Indexed:** 546 files, 7,237 nodes, 12,239 edges
✅ **Database:** `.codegraph/codegraph.db` (14.60 MB)
✅ **Framework:** Angular detected
✅ **Copilot Context:** `copilot-instructions.md` created
✅ **Last updated:** 2026-06-05

## Usage

### Via npm scripts (Recommended)

```bash
# Index the entire project (full reindex)
npm run codegraph:index

# Check index status
npm run codegraph:status

# Manual sync (usually automatic)
npm run codegraph:sync

# Search for symbols
npm run codegraph:query -- 'AppModule'

# Find affected tests (when file changes)
npm run codegraph:affected -- src/shared-utils/src/lib/interceptors.ts
```

### Via CLI directly

```bash
# Global command (if installed globally)
codegraph index --force
codegraph status
codegraph query 'SearchTerm'

# Or via npx
npx @colbymchenry/codegraph index --force
npx @colbymchenry/codegraph status
npx @colbymchenry/codegraph query 'OfertadorFacturasModule'
```

### VS Code Tasks

Use **Terminal → Run Task** to execute:
- `CodeGraph: Index & Watch` (full reindex)
- `CodeGraph: Status` (view statistics)
- `CodeGraph: Sync Changes` (manual sync)

## GitHub Copilot Integration

GitHub Copilot automatically reads `copilot-instructions.md` when you open the project.

**How it works:**
1. Copilot reads architecture guidelines in `copilot-instructions.md`
2. Uses indexed symbols from `.codegraph/index.json`
3. Suggests code respecting MFE boundaries and shared-utils patterns
4. Knows about exports, imports, and module relationships

**To test:**
1. Open a file in any MFE (e.g., `projects/seis-mfe-ofertador-facturas/src/app/app.module.ts`)
2. Ask Copilot in chat: "What imports does AppModule expose?"
3. Copilot uses context from instructions + indexed symbols

## Auto-Sync Setup (Optional)

CodeGraph watches for file changes and syncs automatically (2-second debounce).

To enable explicitly:
```bash
# In background (requires terminal to stay open)
codegraph watch
```

Or, to trigger manually after file edits:
```bash
npm run codegraph:sync
```

## Understanding the Index

### `.codegraph/config.json`
Controls what gets indexed:
- **Languages:** TypeScript, JavaScript (others can be added)
- **Exclude:** node_modules, dist, build (speed up indexing)
- **Frameworks:** Angular (for routing-aware analysis)
- **maxFileSize:** 2MB (skip giant minified files)

### `.codegraph/codegraph.db`
SQLite database (local only, never uploaded):
- Symbol table (functions, classes, methods, imports, exports)
- Relationships (calls, imports, inheritance)
- Full-text search index

### `.codegraph/index.json`
JSON export of all indexed symbols (human-readable):
- Use `npm run codegraph:query -- '*'` to regenerate
- Useful for debugging or custom analysis

## Example Queries

```bash
# Find all OfertadorFacturas references
npm run codegraph:query -- 'OfertadorFacturas'

# Find what imports shared-utils
npm run codegraph:query -- 'shared-utils'

# Find CorrelationIdInterceptor
npm run codegraph:query -- 'CorrelationIdInterceptor'
```

## Performance & Files

| File | Size | Purpose | Commit? |
|------|------|---------|---------|
| `.codegraph/config.json` | ~3KB | Config (what to index) | ✅ Yes |
| `.codegraph/codegraph.db` | ~2.3MB | SQLite database | ❌ No (in .gitignore) |
| `.codegraph/index.json` | ~100KB | JSON symbol export | ❌ No (regenerated) |
| `copilot-instructions.md` | ~8KB | Copilot context | ✅ Yes |

## Troubleshooting

### "Database is locked" error
- Another process is writing (indexing). Wait or manually sync:
  ```bash
  npm run codegraph:sync
  ```

### Copilot not using context
- Restart VS Code (Ctrl+K Ctrl+Q or Cmd+K Cmd+Q)
- Ensure `copilot-instructions.md` is in root
- Check that GitHub Copilot extension is enabled

### Index feels stale
- Rebuild manually:
  ```bash
  npm run codegraph:index
  ```

### Want to exclude more files?
- Edit `.codegraph/config.json` `exclude` array
- Re-index: `npm run codegraph:index`

## Next Steps

1. ✅ CodeGraph installed and indexed
2. ✅ `copilot-instructions.md` created for Copilot
3. ✅ npm scripts added for easy access
4. ✅ VS Code tasks configured

**Try it now:**
- Open a MFE file
- Ask Copilot: "Explain the federation setup"
- Or run: `npm run codegraph:status`

---

**Docs:** https://github.com/colbymchenry/codegraph
**Version:** CodeGraph v0.7.9
**Indexed:** May 19, 2026
