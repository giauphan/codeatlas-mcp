# Changelog

All notable changes to codeatlas-mcp are documented here.

## [1.6.6] - 2026-04-17

### Fixed
- **Security**: Remove `absolutePath` leak from `trace_feature_flow` response (no longer exposes user home directory)
- **Robustness**: Cap BFS depth to max 10 in `trace_feature_flow` and `generate_feature_flow_diagram` to prevent response explosion
- **Debugging**: `loadAnalysis()` now logs error details on JSON parse failure instead of silently returning null

## [1.6.5] - 2026-04-17

### Fixed
- **Data loss prevention**: `business-rules.json` and `change-log.json` now backup corrupt files instead of silently resetting to empty array
- **Deduplication**: Business rules with identical text are no longer added twice
- Added `[CodeAtlas] WARNING` stderr logs when JSON parse fails for debugging
- **conventions.md preserved**: No longer overwrites user/AI-added notes (error patterns, fix guides). Auto-detected sections update separately via HTML marker

---

## [1.6.0] - 2026-04-16

### Added
- **New MCP Tool: `generate_feature_flow_diagram`** — Mermaid execution flow diagrams for features (flowchart + sequence)

---

## [1.5.0] - 2026-04-16

### Changed
- Version sync with CodeAtlas extension v1.5.0 (auto-generate memory feature)

---

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
