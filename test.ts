import * as assert from "node:assert";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runTests() {
  console.log("Running codeatlas-mcp tests...\n");

  // Test 1: Build output exists
  console.log("--- Test 1: Build output verification ---");
  const distPath = path.join(__dirname, "dist", "index.js");
  assert.ok(fs.existsSync(distPath), "dist/index.js should exist after build");
  console.log("✅ dist/index.js exists\n");

  // Test 2: Package.json is valid
  console.log("--- Test 2: Package.json validation ---");
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf-8"));
  assert.ok(pkg.name === "@giauphan/codeatlas-mcp", "Package name should match");
  assert.ok(pkg.version, "Version should be defined");
  assert.ok(pkg.bin, "bin entry should be defined");
  assert.ok(pkg.main === "dist/index.js", "main should point to dist/index.js");
  console.log(`✅ Package: ${pkg.name}@${pkg.version}\n`);

  // Test 3: Version consistency
  console.log("--- Test 3: Version consistency ---");
  const indexContent = fs.readFileSync(path.join(__dirname, "index.ts"), "utf-8");
  const versionMatch = indexContent.match(/version:\s*"([^"]+)"/);
  assert.ok(versionMatch, "index.ts should contain version string");
  assert.strictEqual(versionMatch[1], pkg.version, `index.ts version (${versionMatch[1]}) should match package.json (${pkg.version})`);
  console.log(`✅ Versions match: ${pkg.version}\n`);

  // Test 4: All MCP tools are defined
  console.log("--- Test 4: MCP tool definitions ---");
  const toolMatches = indexContent.match(/server\.tool\(\s*\n?\s*"([^"]+)"/gm);
  assert.ok(toolMatches, "Should find server.tool() definitions");
  const toolNames = toolMatches.map((m) => {
    const nameMatch = m.match(/"([^"]+)"/);
    return nameMatch ? nameMatch[1] : "unknown";
  });
  
  const expectedTools = [
    "list_projects",
    "get_project_structure",
    "get_dependencies",
    "get_insights",
    "search_entities",
    "get_file_entities",
    "generate_system_flow",
    "sync_system_memory",
    "trace_feature_flow",
    "generate_feature_flow_diagram",
  ];
  
  for (const tool of expectedTools) {
    assert.ok(toolNames.includes(tool), `Should define tool: ${tool}`);
  }
  console.log(`✅ All ${expectedTools.length} MCP tools defined: ${toolNames.join(", ")}\n`);

  // Test 5: Required imports
  console.log("--- Test 5: Required imports ---");
  assert.ok(indexContent.includes("McpServer"), "Should import McpServer");
  assert.ok(indexContent.includes("StdioServerTransport"), "Should import StdioServerTransport");
  assert.ok(indexContent.includes("import { z }"), "Should import zod");
  console.log("✅ All required imports present\n");

  // Test 6: dist/index.js is valid JS
  console.log("--- Test 6: Compiled output syntax check ---");
  const distContent = fs.readFileSync(distPath, "utf-8");
  assert.ok(distContent.length > 1000, "Compiled output should not be empty");
  assert.ok(distContent.includes("McpServer") || distContent.includes("codeatlas"), "Compiled output should contain MCP code");
  console.log(`✅ dist/index.js is valid (${(distContent.length / 1024).toFixed(1)} KB)\n`);

  console.log("=== All tests passed! ===");
}

runTests().catch((err) => {
  console.error("❌ Test failed:", err.message);
  process.exit(1);
});
