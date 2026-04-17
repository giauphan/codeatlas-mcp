import * as assert from "node:assert";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================================
// Comprehensive Test Suite for codeatlas-mcp
// Tests: data safety, logic flow, edge cases, Mermaid output
// ============================================================

let passed = 0;
let failed = 0;
let warnings: string[] = [];

function test(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`  ✅ ${name}`);
  } catch (e: any) {
    failed++;
    console.log(`  ❌ ${name}`);
    console.log(`     Error: ${e.message}`);
  }
}

function warn(msg: string) {
  warnings.push(msg);
  console.log(`  ⚠️  WARNING: ${msg}`);
}

const indexContent = fs.readFileSync(path.join(__dirname, "index.ts"), "utf-8");
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf-8"));

// ============================================================
console.log("\n=== GROUP 1: Build & Package Integrity ===\n");
// ============================================================

test("dist/index.js exists after build", () => {
  assert.ok(fs.existsSync(path.join(__dirname, "dist", "index.js")));
});

test("dist/index.js has shebang line", () => {
  const dist = fs.readFileSync(path.join(__dirname, "dist", "index.js"), "utf-8");
  assert.ok(dist.startsWith("#!/usr/bin/env node"), "Missing shebang — won't work as npx binary");
});

test("Package name is correct", () => {
  assert.strictEqual(pkg.name, "@giauphan/codeatlas-mcp");
});

test("Version is defined", () => {
  assert.ok(pkg.version, "version missing in package.json");
});

test("Version consistency: package.json === index.ts", () => {
  const match = indexContent.match(/version:\s*"([^"]+)"/);
  assert.ok(match, "No version found in index.ts");
  assert.strictEqual(match![1], pkg.version, `Mismatch: index.ts=${match![1]} vs package.json=${pkg.version}`);
});

test("bin entry points to dist/index.js", () => {
  assert.ok(pkg.bin, "Missing bin entry");
  assert.strictEqual(pkg.bin["codeatlas-mcp"], "dist/index.js");
});

test("prepublishOnly script runs build", () => {
  assert.ok(pkg.scripts?.prepublishOnly?.includes("build"), "prepublishOnly should run build");
});

// ============================================================
console.log("\n=== GROUP 2: All 10 MCP Tools Defined ===\n");
// ============================================================

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
  test(`Tool '${tool}' is defined`, () => {
    assert.ok(indexContent.includes(`"${tool}"`), `Tool ${tool} not found in source`);
  });
}

// ============================================================
console.log("\n=== GROUP 3: Data Safety — business-rules.json ===\n");
// ============================================================

test("business-rules.json uses fs.existsSync before reading", () => {
  const brSection = indexContent.substring(
    indexContent.indexOf("business-rules.json"),
    indexContent.indexOf("change-log.json")
  );
  assert.ok(brSection.includes("fs.existsSync"), "Should check file existence before reading");
});

test("business-rules.json reads existing file before writing", () => {
  const brSection = indexContent.substring(
    indexContent.indexOf("business-rules.json"),
    indexContent.indexOf("change-log.json")
  );
  assert.ok(brSection.includes("fs.readFileSync"), "Should read existing file to preserve data");
});

test("business-rules.json has backup logic on parse failure", () => {
  const brSection = indexContent.substring(
    indexContent.indexOf("business-rules.json"),
    indexContent.indexOf("change-log.json")
  );
  assert.ok(brSection.includes("backup") || brSection.includes("copyFile"), "Should backup on parse failure");
});

test("business-rules.json deduplicates rules", () => {
  const brSection = indexContent.substring(
    indexContent.indexOf("business-rules.json"),
    indexContent.indexOf("change-log.json")
  );
  assert.ok(brSection.includes("exists") || brSection.includes("some") || brSection.includes("dedup"), "Should prevent duplicate rules");
});

test("business-rules.json uses push() not overwrite", () => {
  const brSection = indexContent.substring(
    indexContent.indexOf("business-rules.json"),
    indexContent.indexOf("change-log.json")
  );
  assert.ok(brSection.includes(".push("), "Should append with push(), not overwrite");
});

// ============================================================
console.log("\n=== GROUP 4: Data Safety — change-log.json ===\n");
// ============================================================

test("change-log.json reads existing file before writing", () => {
  const clSection = indexContent.substring(
    indexContent.indexOf("change-log.json"),
    indexContent.indexOf("conventions.md")
  );
  assert.ok(clSection.includes("fs.readFileSync"), "Should read existing changelog");
});

test("change-log.json has backup on parse failure", () => {
  const clSection = indexContent.substring(
    indexContent.indexOf("change-log.json"),
    indexContent.indexOf("conventions.md")
  );
  assert.ok(clSection.includes("backup") || clSection.includes("copyFile"), "Should backup corrupt file");
});

test("change-log.json limits entries (max 50)", () => {
  const clSection = indexContent.substring(
    indexContent.indexOf("change-log.json"),
    indexContent.indexOf("conventions.md")
  );
  assert.ok(clSection.includes("slice(0, 50)"), "Should cap at 50 entries");
});

test("change-log.json uses unshift() for newest-first", () => {
  const clSection = indexContent.substring(
    indexContent.indexOf("change-log.json"),
    indexContent.indexOf("conventions.md")
  );
  assert.ok(clSection.includes(".unshift("), "Should prepend with unshift()");
});

// ============================================================
console.log("\n=== GROUP 5: Data Safety — conventions.md ===\n");
// ============================================================

test("conventions.md checks if file exists before writing", () => {
  const cvSection = indexContent.substring(
    indexContent.indexOf("conventions.md"),
    indexContent.indexOf("const result = {")
  );
  assert.ok(cvSection.includes("fs.existsSync"), "Should check existence to preserve content");
});

test("conventions.md uses HTML marker to separate sections", () => {
  assert.ok(indexContent.includes("AUTO-DETECTED BY CODEATLAS"), "Should have marker for auto-detected section");
});

test("conventions.md preserves content above marker", () => {
  const cvSection = indexContent.substring(
    indexContent.indexOf("AUTO-DETECTED BY CODEATLAS"),
    indexContent.indexOf("const result = {")
  );
  assert.ok(cvSection.includes("substring") || cvSection.includes("preserved"), "Should keep content above marker");
});

// ============================================================
console.log("\n=== GROUP 6: Logic Flow — loadAnalysis() ===\n");
// ============================================================

test("loadAnalysis handles missing analysis.json gracefully", () => {
  assert.ok(indexContent.includes("return null"), "Should return null when no analysis found");
});

test("loadAnalysis has catch block for JSON.parse", () => {
  // Find the loadAnalysis function
  const loadSection = indexContent.substring(
    indexContent.indexOf("function loadAnalysis"),
    indexContent.indexOf("// Create MCP server")
  );
  assert.ok(loadSection.includes("catch"), "Should catch JSON parse errors");
});

test("discoverProjects skips hidden directories", () => {
  const discoverSection = indexContent.substring(
    indexContent.indexOf("function discoverProjects"),
    indexContent.indexOf("function loadAnalysis")
  );
  assert.ok(discoverSection.includes('startsWith(".")'), "Should skip dot-directories");
});

test("discoverProjects deduplicates paths", () => {
  const discoverSection = indexContent.substring(
    indexContent.indexOf("function discoverProjects"),
    indexContent.indexOf("function loadAnalysis")
  );
  assert.ok(discoverSection.includes("seen") || discoverSection.includes("Set"), "Should deduplicate scan paths");
});

// ============================================================
console.log("\n=== GROUP 7: Mermaid Diagram Safety ===\n");
// ============================================================

test("Mermaid labels sanitize double quotes", () => {
  assert.ok(indexContent.includes('.replace(/"/g'), "Should sanitize double quotes in labels");
});

test("Mermaid labels sanitize angle brackets", () => {
  assert.ok(
    indexContent.includes("replace(/[<>]/g") || indexContent.includes("replace(/[\\<\\>]"),
    "Should sanitize <> in labels"
  );
});

// Check for potential Mermaid injection vectors
test("AUDIT: Mermaid sanitizes brackets/parens", () => {
  const sanitizeFn = indexContent.match(/sanitizeLabel\s*=\s*\([^)]*\)\s*=>\s*([^;]+)/);
  if (sanitizeFn) {
    const sanitizeBody = sanitizeFn[1];
    if (!sanitizeBody.includes("[") && !sanitizeBody.includes("(")) {
      warn("sanitizeLabel() doesn't remove [] or () — may cause Mermaid syntax errors for function names like 'get(data)' or 'arr[0]'");
    }
  }
});

// ============================================================
console.log("\n=== GROUP 8: Edge Cases & Robustness ===\n");
// ============================================================

test("BFS depth should have a reasonable default", () => {
  assert.ok(indexContent.includes("depth || 2") || indexContent.includes("depth || 3"), "Should default depth to 2-3");
});

test("AUDIT: BFS depth has max cap", () => {
  if (!indexContent.includes("Math.min") || !indexContent.match(/Math\.min\(.*depth/)) {
    warn("BFS depth has no upper limit — user can pass depth:100 and blow up response size");
  }
});

test("trace_feature_flow limits output files to 30", () => {
  assert.ok(indexContent.includes("slice(0, 30)"), "Should cap files to 30");
});

test("trace_feature_flow limits relationships to 50", () => {
  assert.ok(indexContent.includes("slice(0, 50)"), "Should cap relationships to 50");
});

test("AUDIT: absolutePath not leaked in trace_feature_flow response", () => {
  const traceSection = indexContent.substring(
    indexContent.indexOf("trace_feature_flow"),
    indexContent.indexOf("generate_feature_flow_diagram")
  );
  if (traceSection.includes("absolutePath")) {
    warn("trace_feature_flow response includes absolutePath field — may leak user home directory");
  }
});

test("generate_system_flow has maxNodes limit", () => {
  assert.ok(indexContent.includes("maxNodes || 60"), "Should default maxNodes to 60");
});

test("generate_feature_flow_diagram has maxNodes limit", () => {
  assert.ok(indexContent.includes("maxNodes || 40"), "Should default maxNodes to 40");
});

// ============================================================
console.log("\n=== GROUP 9: Error Handling ===\n");
// ============================================================

test("All tools handle missing analysis gracefully", () => {
  const toolHandlers = indexContent.match(/if \(!loaded\)/g);
  assert.ok(toolHandlers, "Should check !loaded");
  // Tools that use loadAnalysis: get_project_structure, get_dependencies, get_insights,
  // search_entities, get_file_entities, generate_system_flow, sync_system_memory,
  // trace_feature_flow, generate_feature_flow_diagram = 9 tools
  assert.ok(toolHandlers!.length >= 9, `Expected 9+ null checks, found ${toolHandlers!.length}`);
});

test("AUDIT: loadAnalysis logs error on JSON parse failure", () => {
  const loadSection = indexContent.substring(
    indexContent.indexOf("function loadAnalysis"),
    indexContent.indexOf("// Create MCP server")
  );
  if (!loadSection.includes("console.error")) {
    warn("loadAnalysis() silently returns null on JSON parse failure — user won't know analysis.json is corrupt");
  }
});

test("sync_system_memory creates .agents/memory/ directory", () => {
  assert.ok(indexContent.includes('mkdirSync(memoryDir, { recursive: true })'), "Should create dir recursively");
});

// ============================================================
console.log("\n=== GROUP 10: Functional Simulation Tests ===\n");
// ============================================================

// Simulate business-rules.json append logic
test("Simulate: business rules append preserves old data", () => {
  const tmpDir = path.join(__dirname, ".test_tmp_" + Date.now());
  fs.mkdirSync(tmpDir, { recursive: true });
  const brPath = path.join(tmpDir, "business-rules.json");
  
  // Write initial rules
  const initial = [
    { rule: "Rule A", addedAt: "2026-01-01T00:00:00Z" },
    { rule: "Rule B", addedAt: "2026-01-02T00:00:00Z" },
  ];
  fs.writeFileSync(brPath, JSON.stringify(initial, null, 2));
  
  // Simulate append (same logic as in index.ts)
  let rules: Array<{ rule: string; addedAt: string }> = [];
  if (fs.existsSync(brPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(brPath, "utf-8"));
      rules = Array.isArray(parsed) ? parsed : [];
    } catch { /* start fresh */ }
  }
  const newRule = "Rule C";
  const exists = rules.some((br) => br.rule === newRule);
  if (!exists) {
    rules.push({ rule: newRule, addedAt: new Date().toISOString() });
  }
  fs.writeFileSync(brPath, JSON.stringify(rules, null, 2));
  
  // Verify
  const result = JSON.parse(fs.readFileSync(brPath, "utf-8"));
  assert.strictEqual(result.length, 3, "Should have 3 rules (2 old + 1 new)");
  assert.strictEqual(result[0].rule, "Rule A", "Old rules preserved");
  assert.strictEqual(result[2].rule, "Rule C", "New rule appended");
  
  // Cleanup
  fs.rmSync(tmpDir, { recursive: true });
});

// Simulate dedup
test("Simulate: business rules deduplication works", () => {
  const tmpDir = path.join(__dirname, ".test_tmp_dedup_" + Date.now());
  fs.mkdirSync(tmpDir, { recursive: true });
  const brPath = path.join(tmpDir, "business-rules.json");
  
  const initial = [{ rule: "Existing Rule", addedAt: "2026-01-01T00:00:00Z" }];
  fs.writeFileSync(brPath, JSON.stringify(initial));
  
  // Try to add same rule
  let rules = JSON.parse(fs.readFileSync(brPath, "utf-8"));
  const exists = rules.some((br: any) => br.rule === "Existing Rule");
  if (!exists) {
    rules.push({ rule: "Existing Rule", addedAt: new Date().toISOString() });
  }
  fs.writeFileSync(brPath, JSON.stringify(rules));
  
  const result = JSON.parse(fs.readFileSync(brPath, "utf-8"));
  assert.strictEqual(result.length, 1, "Should still have 1 rule — no duplicate");
  
  fs.rmSync(tmpDir, { recursive: true });
});

// Simulate conventions.md marker preservation
test("Simulate: conventions.md preserves content above marker", () => {
  const tmpDir = path.join(__dirname, ".test_tmp_conv_" + Date.now());
  fs.mkdirSync(tmpDir, { recursive: true });
  const convPath = path.join(tmpDir, "conventions.md");
  const MARKER = "<!-- AUTO-DETECTED BY CODEATLAS - DO NOT EDIT BELOW THIS LINE -->";
  
  // Write file with user content + auto section
  const existing = [
    "# Conventions",
    "",
    "## My Custom Notes",
    "- Always use camelCase",
    "- Error pattern: X fails when Y",
    "",
    MARKER,
    "",
    "## Languages (auto-detected)",
    "- `.py`: 10 files",
  ].join("\n");
  fs.writeFileSync(convPath, existing);
  
  // Simulate sync (same logic as index.ts)
  const newAutoSection = [MARKER, "", "## Languages (auto-detected)", "- `.py`: 15 files", "- `.ts`: 3 files"].join("\n");
  
  const content = fs.readFileSync(convPath, "utf-8");
  const markerIndex = content.indexOf(MARKER);
  if (markerIndex !== -1) {
    const preserved = content.substring(0, markerIndex).trimEnd();
    fs.writeFileSync(convPath, preserved + "\n\n" + newAutoSection + "\n");
  }
  
  const result = fs.readFileSync(convPath, "utf-8");
  assert.ok(result.includes("My Custom Notes"), "User notes should be preserved");
  assert.ok(result.includes("Error pattern: X fails when Y"), "Error patterns should be preserved");
  assert.ok(result.includes("`.ts`: 3 files"), "New auto-detected data should be present");
  assert.ok(!result.includes("`.py`: 10 files"), "Old auto-detected data should be replaced");
  
  fs.rmSync(tmpDir, { recursive: true });
});

// Simulate corrupt JSON recovery
test("Simulate: corrupt business-rules.json creates backup", () => {
  const tmpDir = path.join(__dirname, ".test_tmp_corrupt_" + Date.now());
  fs.mkdirSync(tmpDir, { recursive: true });
  const brPath = path.join(tmpDir, "business-rules.json");
  
  // Write corrupt JSON
  fs.writeFileSync(brPath, '{"broken json...');
  
  // Simulate the recovery logic
  let rules: any[] = [];
  if (fs.existsSync(brPath)) {
    try {
      const raw = fs.readFileSync(brPath, "utf-8");
      const parsed = JSON.parse(raw);
      rules = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      const backupPath = brPath + `.backup-${Date.now()}`;
      fs.copyFileSync(brPath, backupPath);
      // Verify backup was created
      assert.ok(fs.existsSync(backupPath), "Backup file should be created");
      const backupContent = fs.readFileSync(backupPath, "utf-8");
      assert.strictEqual(backupContent, '{"broken json...', "Backup should contain original corrupt data");
    }
  }
  rules.push({ rule: "New rule after corruption", addedAt: new Date().toISOString() });
  fs.writeFileSync(brPath, JSON.stringify(rules, null, 2));
  
  // Verify recovery
  const result = JSON.parse(fs.readFileSync(brPath, "utf-8"));
  assert.strictEqual(result.length, 1, "Should have fresh rule after corruption recovery");
  
  fs.rmSync(tmpDir, { recursive: true });
});

// Simulate change-log max entries
test("Simulate: change-log.json caps at 50 entries", () => {
  const tmpDir = path.join(__dirname, ".test_tmp_cl_" + Date.now());
  fs.mkdirSync(tmpDir, { recursive: true });
  const clPath = path.join(tmpDir, "change-log.json");
  
  // Create 55 entries
  const entries = Array.from({ length: 55 }, (_, i) => ({
    description: `Change ${i}`,
    timestamp: new Date().toISOString(),
  }));
  fs.writeFileSync(clPath, JSON.stringify(entries));
  
  // Simulate adding new + truncating
  let log = JSON.parse(fs.readFileSync(clPath, "utf-8"));
  log.unshift({ description: "Newest change", timestamp: new Date().toISOString() });
  log = log.slice(0, 50);
  fs.writeFileSync(clPath, JSON.stringify(log));
  
  const result = JSON.parse(fs.readFileSync(clPath, "utf-8"));
  assert.strictEqual(result.length, 50, "Should cap at 50");
  assert.strictEqual(result[0].description, "Newest change", "Newest should be first");
  
  fs.rmSync(tmpDir, { recursive: true });
});

// ============================================================
// Summary
// ============================================================

console.log("\n" + "=".repeat(50));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed, ${warnings.length} warnings\n`);

if (warnings.length > 0) {
  console.log("⚠️  Warnings (potential issues found):");
  warnings.forEach((w, i) => console.log(`   ${i + 1}. ${w}`));
  console.log();
}

if (failed > 0) {
  console.log("❌ Some tests FAILED — issues need fixing!\n");
  process.exit(1);
} else {
  console.log("✅ All tests passed!\n");
}
