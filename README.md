# 🗺️ CodeAtlas MCP Server

[![npm version](https://img.shields.io/npm/v/@giauphan/codeatlas-mcp.svg)](https://www.npmjs.com/package/@giauphan/codeatlas-mcp)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript)
![Node](https://img.shields.io/badge/Node-%3E%3D18-brightgreen?logo=node.js)

> A standalone [MCP](https://modelcontextprotocol.io/) server that exposes [CodeAtlas](https://github.com/giauphan/CodeAtlas) analysis data to AI assistants — **Gemini, Claude, Cursor, Windsurf**, and more.

---

## ⚡ Quick Start

### 1. Analyze your project

Install the [CodeAtlas VS Code extension](https://github.com/giauphan/CodeAtlas), then run:

```
Ctrl+Shift+P → CodeAtlas: Analyze Project
```

This generates `.codeatlas/analysis.json` in your project root.

### 2. Add MCP config

Copy the JSON block below into **one** of these files depending on your AI assistant:

| AI Assistant | Config file |
|---|---|
| **Gemini** | `.gemini/settings.json` |
| **Claude Desktop** | `claude_desktop_config.json` |
| **Cursor** | `.cursor/mcp.json` |
| **Windsurf** | `.windsurf/mcp.json` |

```json
{
  "mcpServers": {
    "codeatlas": {
      "command": "npx",
      "args": ["-y", "@giauphan/codeatlas-mcp"]
    }
  }
}
```

> **That's it!** Your AI assistant can now query your codebase structure, dependencies, and insights.

---

## 🛠️ Available Tools

| Tool | Description |
|------|-------------|
| `list_projects` | List all analyzed projects (auto-discovers `~/`) |
| `get_project_structure` | Get modules, classes, functions, variables |
| `get_dependencies` | Get import / call / containment relationships |
| `get_insights` | Get AI-generated code quality insights |
| `search_entities` | Search functions, classes by name (fuzzy match) |
| `get_file_entities` | Get all entities defined in a specific file |

---

## 📦 Alternative: Global Install

If you prefer installing globally instead of using `npx`:

```bash
npm install -g @giauphan/codeatlas-mcp
```

Then update your MCP config to:

```json
{
  "mcpServers": {
    "codeatlas": {
      "command": "codeatlas-mcp"
    }
  }
}
```

---

## 🔧 Environment Variables

| Variable | Description |
|----------|-------------|
| `CODEATLAS_PROJECT_DIR` | Force a specific project directory |

> By default, the server **auto-discovers** all projects with `.codeatlas/analysis.json` under your home directory.

---

## 🧑‍💻 Development

```bash
git clone https://github.com/giauphan/codeatlas-mcp.git
cd codeatlas-mcp
npm install
npm run build
npm start
```

## License

[MIT](LICENSE)
