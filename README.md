# 🗺️ CodeAtlas MCP Server

**MCP server for [CodeAtlas](https://github.com/giauphan/CodeAtlas) — Expose code analysis data to AI assistants**

![License](https://img.shields.io/badge/License-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript)

## What is this?

A standalone [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server that reads CodeAtlas analysis data and exposes it to AI assistants like **Gemini, Claude, Cursor**, etc.

## Tools

| Tool | Description |
|------|-------------|
| `list_projects` | List all projects analyzed by CodeAtlas |
| `get_project_structure` | Get modules, classes, functions, variables |
| `get_dependencies` | Get import/call/containment relationships |
| `get_insights` | Get AI-generated code insights |
| `search_entities` | Search for functions, classes by name |
| `get_file_entities` | Get all entities in a specific file |

## Prerequisites

1. Install the [CodeAtlas VS Code extension](https://github.com/giauphan/CodeAtlas)
2. Run **CodeAtlas: Analyze Project** in VS Code to generate `.codeatlas/analysis.json`

## Installation

```bash
git clone https://github.com/giauphan/codeatlas-mcp.git
cd codeatlas-mcp
npm install
npm run build
```

## Configuration

Add to your AI assistant's MCP config:

### Gemini (`.gemini/settings.json`)

```json
{
  "mcpServers": {
    "codeatlas": {
      "command": "node",
      "args": ["/absolute/path/to/codeatlas-mcp/dist/index.js"]
    }
  }
}
```

### Claude (`claude_desktop_config.json`)

```json
{
  "mcpServers": {
    "codeatlas": {
      "command": "node",
      "args": ["/absolute/path/to/codeatlas-mcp/dist/index.js"]
    }
  }
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `CODEATLAS_PROJECT_DIR` | Optional: specify a project directory to analyze |

The server auto-discovers projects by scanning `~/` for `.codeatlas/analysis.json` files.

## License

[MIT](LICENSE)
