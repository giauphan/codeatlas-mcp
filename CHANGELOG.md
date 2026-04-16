# Changelog

All notable changes to codeatlas-mcp are documented here.

## [1.4.3] - 2026-04-16

### Fixed
- Ensure `JSON.parse` results are validated as arrays before calling `.push()` / `.unshift()` — prevents runtime errors when `business-rules.json` or `change-log.json` contain non-array data

---

## [1.4.2] - 2026-04-08

### Fixed
- Handle undefined `stats` in `AnalysisResult` — prevents `Cannot read properties of undefined` errors
- Made `stats`, `entityCounts`, `totalFilesAnalyzed` optional with null-coalescing fallbacks

---

## [1.4.1] - 2026-04-03

### Fixed
- Fixed `.agent/memory/` → `.agents/memory/` path

---

## [1.4.0] - 2026-04-03

### Added
- `generate_system_flow` MCP tool
- `sync_system_memory` MCP tool
- `trace_feature_flow` MCP tool
