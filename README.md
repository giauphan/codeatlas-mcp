# 🗺️ CodeAtlas MCP Server

**Give your AI assistant deep understanding of any codebase**

[![npm](https://img.shields.io/npm/v/@giauphan/codeatlas-mcp?logo=npm)](https://www.npmjs.com/package/@giauphan/codeatlas-mcp)
[![CI](https://github.com/giauphan/codeatlas-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/giauphan/codeatlas-mcp/actions)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node](https://img.shields.io/badge/Node-%3E%3D18-brightgreen?logo=node.js)](https://nodejs.org/)

> A standalone [MCP](https://modelcontextprotocol.io/) server that exposes code analysis data to **Gemini, Claude, Cursor, Windsurf, VS Code Copilot** — with persistent AI memory between conversations.

---

## ✨ What Does It Do?

```
Your Code → CodeAtlas Analyze → MCP Server → AI Understands Everything
                                     │
                              10 powerful tools:
                              • Search functions & classes
                              • Trace feature flows
                              • Generate architecture diagrams
                              • Persistent memory across conversations
```

**Before CodeAtlas:** AI greps blindly, forgets your project every conversation.
**After CodeAtlas:** AI instantly knows your architecture, dependencies, and remembers context.

---

## 🚀 Setup (1 minute)

### 1. Analyze your project

Install the [CodeAtlas extension](https://github.com/giauphan/CodeAtlas), then:

```
Ctrl+Shift+P → CodeAtlas: Analyze Project
```

### 2. Add MCP config to your AI

<details>
<summary>🟢 <b>Gemini / Antigravity</b> — <code>.gemini/settings.json</code></summary>

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
<summary>⚫ <b>Cursor</b> — <code>.cursor/mcp.json</code></summary>

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
<summary>🔵 <b>VS Code Copilot</b> — <code>.vscode/settings.json</code></summary>

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
</details>

<details>
<summary>🟣 <b>Claude Desktop</b> — <code>claude_desktop_config.json</code></summary>

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
<summary>🟣 <b>Claude Code CLI</b></summary>

```bash
claude mcp add codeatlas -- npx -y @giauphan/codeatlas-mcp
```
</details>

<details>
<summary>🔴 <b>Windsurf</b> — <code>.windsurf/mcp.json</code></summary>

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

> **Done!** Your AI can now use all 10 CodeAtlas tools.

---

## 🛠️ 10 MCP Tools

### Code Analysis (6 tools)

| Tool | Description | Example Use |
|------|-------------|-------------|
| `list_projects` | List all analyzed projects | "What projects do I have?" |
| `get_project_structure` | Get modules, classes, functions | "Show me all classes" |
| `get_dependencies` | Import/call/containment relationships | "What does UserService depend on?" |
| `get_insights` | Code quality & security analysis | "Any security issues?" |
| `search_entities` | Fuzzy search entities by name | "Find the login function" |
| `get_file_entities` | All entities in a specific file | "What's in auth.ts?" |

### Architecture Visualization (2 tools)

| Tool | Description | Example Use |
|------|-------------|-------------|
| `generate_system_flow` | Mermaid architecture diagram (module imports) | "Show me the system architecture" |
| `generate_feature_flow_diagram` ⭐ | Mermaid execution flow diagram (call chains) | "How does the payment feature work?" |

### AI Memory (2 tools)

| Tool | Description | Example Use |
|------|-------------|-------------|
| `sync_system_memory` | Save context to `.agents/memory/` | "Remember what we changed" |
| `trace_feature_flow` | Trace feature through codebase | "What files are involved in auth?" |

---

## 🧠 AI Memory — Persistent Context

AI assistants forget everything between conversations. CodeAtlas fixes this:

```
Conversation 1 → AI analyzes code → sync_system_memory
                                          │
                                   .agents/memory/
                                   ├── system-map.md       ← Architecture diagram
                                   ├── modules.json        ← All entities
                                   ├── conventions.md      ← Code patterns
                                   ├── business-rules.json ← Domain logic
                                   ├── feature-flows.json  ← Feature traces
                                   └── change-log.json     ← Change history
                                          │
Conversation 2 → AI reads memory → full context restored instantly ✨
```

### Auto-Generated IDE Rules

When you run `Analyze Project`, CodeAtlas auto-creates rule files for your AI IDE:

| Generated File | For |
|---|---|
| `.agents/rules/codeatlas-mcp.md` | All AI assistants |
| `.cursor/rules/codeatlas.mdc` | Cursor |
| `CLAUDE.md` | Claude Code |
| `.windsurfrules` | Windsurf |

These tell your AI to:
1. Read `.agents/memory/` at the start of every conversation
2. Use MCP tools before making changes
3. Call `sync_system_memory` after completing changes

---

## 🌍 Supported Languages

| Language | Features |
|----------|----------|
| **TypeScript / JavaScript** | Full AST: imports, classes, functions, variables, calls, implements |
| **Python** | Classes, functions, variables, imports, calls |
| **PHP** | Classes, interfaces, traits, enums, functions, properties |
| **Blade Templates** | `@extends`, `@include`, `@component`, `<x-component>` |

---

## 📦 Alternative: Global Install

```bash
npm install -g @giauphan/codeatlas-mcp
```

Then use `"command": "codeatlas-mcp"` in your MCP config (no `args` needed).

---

## 🔧 Environment Variables

| Variable | Description |
|----------|-------------|
| `CODEATLAS_PROJECT_DIR` | Force a specific project directory |

> By default, the server auto-discovers all projects with `.codeatlas/analysis.json` under `~/`.

---

## 🧑‍💻 Development

```bash
git clone https://github.com/giauphan/codeatlas-mcp.git
cd codeatlas-mcp
npm install
npm run build
npm test    # 6 tests
npm start   # Start MCP server
```

---

## 🔗 Related

- [CodeAtlas Extension](https://github.com/giauphan/CodeAtlas) — VS Code extension with interactive code graph
- [MCP Protocol](https://modelcontextprotocol.io/) — Model Context Protocol standard

## License

[MIT](LICENSE) — Free for personal and commercial use.
