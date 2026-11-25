import { test } from "node:test";
import assert from "node:assert/strict";
import { isCandidateBranch, isAllowedFile, readyChecks } from "../strumenti/auto-pubblicazione-editoriale.mjs";

test("automerge solo per il branch editoriale giornaliero esatto", () => {
  assert.equal(isCandidateBranch("contenuti/2026-11-26"), true);
  for (const branch of ["contenuti/2026-11-28-mondiale-console", "feat/foo", "contenuti/urgent", "contenuti/2026-11-26-urgente-witcher"])
    assert.equal(isCandidateBranch(branch), false, branch);
});

test("sono ammessi soltanto nuovi markdown di articoli o traduzioni", () => {
  const ok = { status: "added", changes: 40, filename: "content/articoli/2026-11-26-notizia.md" };
  assert.equal(isAllowedFile(ok), true);
  assert.equal(isAllowedFile({ ...ok, filename: "content/traduzioni/en/2026-11-26-notizia.md" }), true);
  for (const filename of ["build.mjs", ".github/workflows/verifica.yml", "content/pagine/it/premi-start.md", "content/articoli/file.js"])
    assert.equal(isAllowedFile({ ...ok, filename }), false, filename);
  assert.equal(isAllowedFile({ ...ok, status: "modified" }), false);
  assert.equal(isAllowedFile({ ...ok, status: "removed" }), false);
  assert.equal(isAllowedFile({ ...ok, changes: 60001 }), false);
});

test("servono build, gate e preview Netlify tutti completati sull'HEAD", () => {
  const checks = ["build", "gate-editoriale-dry-run"].map(name => ({
    name, status: "completed", conclusion: "success", app: { slug: "github-actions" }
  }));
  const statuses = [{
    context: "netlify/cute-bublanina-801681/deploy-preview",
    state: "success",
    target_url: "https://deploy-preview-85--cute-bublanina-801681.netlify.app"
  }];
  assert.equal(readyChecks(checks, statuses, 85), true);
  assert.equal(readyChecks(checks, statuses, 84), false);
  assert.equal(readyChecks(checks, [{ ...statuses[0], state: "pending" }], 85), false);
  assert.equal(readyChecks(checks.slice(0, 1), statuses, 85), false);
  assert.equal(readyChecks([{ ...checks[0], conclusion: "failure" }, checks[1]], statuses, 85), false);
  assert.equal(readyChecks([{ ...checks[0], app: {slug:"unknown"} }, checks[1]], statuses, 85), false);
});
