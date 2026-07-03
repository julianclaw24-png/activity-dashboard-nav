import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const html = readFileSync(resolve("index.html"), "utf8");

test("desktop content max width token exists", () => {
  assert.match(html, /--content-max:\s*1[34]\d{2}px/);
});

test("desktop row reflow classes exist", () => {
  assert.match(
    html,
    /\.board-grid\s*\{[^}]*grid-template-columns:\s*1\.35fr\s+0\.95fr;/s,
  );
  assert.match(
    html,
    /\.ops-grid\s*\{[^}]*grid-template-columns:\s*1fr\s+1fr;/s,
  );
});

test("assistant dock has desktop collapse state handling", () => {
  assert.match(html, /assistantDockDesktopExpanded:\s*false/);
  assert.match(
    html,
    /const expanded = mobile \? !!state\.assistantDockExpanded : !!state\.assistantDockDesktopExpanded;/,
  );
});
