# 🗺️ CodeAtlas MCP Server

[![npm version](https://img.shields.io/npm/v/@giauphan/codeatlas-mcp.svg)](https://www.npmjs.com/package/@giauphan/codeatlas-mcp)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript)
![Node](https://img.shields.io/badge/Node-%3E%3D18-brightgreen?logo=node.js)

> A standalone [MCP](https://modelcontextprotocol.io/) server that exposes [CodeAtlas](https://github.com/giauphan/CodeAtlas) analysis data to AI assistants — **Gemini, Claude, Cursor, Windsurf, VS Code Copilot**, and more.

**NEW in v1.4.0**: 🧠 **AI System Memory** — AI remembers your system flow between conversations.

---

## ⚡ Quick Start

### 1. Analyze your project

Install the [CodeAtlas VS Code extension](https://github.com/giauphan/CodeAtlas), then run:

```
Ctrl+Shift+P → CodeAtlas: Analyze Project
```

This generates `.codeatlas/analysis.json` in your project root.

### 2. Add MCP config

Pick your AI assistant and add the config:

<details>
<summary>🔵 <b>VS Code (Copilot / GitHub Copilot Chat)</b></summary>

Open **Settings** (`Ctrl+,`) → search `mcp` → click **Edit in settings.json**, then add:

```json
{
  "mcp": {
    "servers": {
      "codeatlas": {
        "command": "npx",
        "args": ["-y", "@giauphan/codeatlas-mcp"]
      }
    }
  }
}
```

Or add via workspace `.vscode/settings.json` for per-project config.

</details>

<details>
<summary>🟢 <b>Gemini</b></summary>

Add to `.gemini/settings.json`:

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

</details>

<details>
<summary>🟣 <b>Claude Desktop</b></summary>

Add to `claude_desktop_config.json`:

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

</details>

<details>
<summary>⚫ <b>Cursor</b></summary>

Add to `.cursor/mcp.json`:

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

</details>

<details>
<summary>🔴 <b>Windsurf</b></summary>

Add to `.windsurf/mcp.json`:

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

</details>

> **That's it!** Your AI assistant can now query your codebase structure, dependencies, and insights.

---

## 🛠️ Available Tools

### Code Analysis (6 tools)

| Tool | Description |
|------|-------------|
| `list_projects` | List all analyzed projects (auto-discovers `~/`) |
| `get_project_structure` | Get modules, classes, functions, variables |
| `get_dependencies` | Get import / call / containment relationships |
| `get_insights` | Get AI-generated code quality insights |
| `search_entities` | Search functions, classes by name (fuzzy match) |
| `get_file_entities` | Get all entities defined in a specific file |

### 🧠 AI System Memory (3 tools — NEW in v1.4.0)

| Tool | Description |
|------|-------------|
| `generate_system_flow` | Auto-generate Mermaid architecture diagrams. Scopes: `modules-only`, `full`, `feature` |
| `sync_system_memory` | Create/update `.agents/memory/` folder — AI's persistent long-term memory |
| `trace_feature_flow` | Trace a feature's flow through the codebase. Returns files in dependency order |

---

## 🧠 AI System Memory

AI assistants lose context between conversations. CodeAtlas MCP solves this with **persistent memory files**.

### How it works

```
Conversation 1 → AI writes code → calls sync_system_memory
                                          │
                                   .agents/memory/
                                   ├── system-map.md
                                   ├── modules.json
                                   ├── business-rules.json
                                   ├── conventions.md
                                   ├── feature-flows.json
                                   └── change-log.json
                                          │
Conversation 2 → AI reads .agents/memory/ → knows full system flow instantly
```

### Setup AI Memory

1. Copy rule templates to your project:

```bash
mkdir -p /path/to/your-project/.agents/rules/
```

2. Create `.agents/rules/auto-memory.md` with the rule that tells AI to:
   - Read `.agents/memory/` at the start of every conversation
   - Use `trace_feature_flow` before making changes
   - Call `sync_system_memory` after completing changes

3. Run `sync_system_memory` once to generate the initial memory snapshot.

> 📖 Full setup guide & rule templates: [CodeAtlas docs](https://github.com/giauphan/CodeAtlas/tree/main/docs)

---

## 📦 Alternative: Global Install

If you prefer installing globally instead of using `npx`:

```bash
npm install -g @giauphan/codeatlas-mcp
```

Then use `"command": "codeatlas-mcp"` (no `args` needed) in your MCP config.

---

## 🔧 Environment Variables

| Variable | Description |
|----------|-------------|
| `CODEATLAS_PROJECT_DIR` | Force a specific project directory |

> By default, the server **auto-discovers** all projects with `.codeatlas/analysis.json` under your home directory.

---

## 🌐 Supported Languages

| Language | Features |
|----------|----------|
| TypeScript / JavaScript | Full AST: imports, classes, functions, variables, calls |
| Python | Classes, functions, variables, imports, calls |
| PHP | Classes, interfaces, traits, enums, functions, properties, constants |
| Blade Templates | `@extends`, `@include`, `@component`, `<x-component>` |

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
