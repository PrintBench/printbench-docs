import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile, cp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

async function fixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), "pb-docs-sync-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const site = path.join(root, "site");
  const source = path.join(root, "app");
  await mkdir(path.join(site, "scripts"), { recursive: true });
  await mkdir(path.join(source, "docs/releases"), { recursive: true });
  await cp(
    new URL("./sync.mjs", import.meta.url),
    path.join(site, "scripts/sync.mjs"),
  );
  await writeFile(
    path.join(source, "CONTRIBUTING.md"),
    [
      "Getting set up",
      "Running the checks",
      "Things worth knowing before you change them",
      "Commits and pull requests",
    ]
      .map((title) => `## ${title}\n\nOriginal ${title}\n`)
      .join("\n"),
  );
  await writeFile(
    path.join(source, "SECURITY.md"),
    "# Security policy\n\n[Deploy](docs/deployment.md)\n",
  );
  await writeFile(
    path.join(source, "docs/releasing.md"),
    "# Releasing\n\nChecklist\n",
  );
  for (const tag of ["v0.9.0", "v0.10.0-rc.2", "v0.10.0-rc.10", "v0.10.0"])
    await writeFile(
      path.join(source, `docs/releases/${tag}.md`),
      `# ${tag}\n\nAuthored content [imports](../model-imports.md)\n`,
    );
  const run = (...args) =>
    spawnSync(
      process.execPath,
      [path.join(site, "scripts/sync.mjs"), "--source", source, ...args],
      { encoding: "utf8" },
    );
  return { site, source, run };
}

test("sync updates new releases, preserves handwritten pages and check never writes", async (t) => {
  const { site, source, run } = await fixture(t);
  await mkdir(path.join(site, "docs/guide"), { recursive: true });
  const handwritten = path.join(site, "docs/guide/example.md");
  await writeFile(handwritten, "Keep this handwritten page.\n");
  assert.equal(run("--check").status, 1);
  assert.equal(run().status, 0);
  assert.equal(run("--check").status, 0);
  const items = JSON.parse(
    await readFile(path.join(site, "docs/.vitepress/releases.json"), "utf8"),
  );
  assert.deepEqual(
    items.map(({ text }) => text),
    ["v0.10.0", "v0.10.0-rc.10", "v0.10.0-rc.2", "v0.9.0"],
  );
  assert.match(
    await readFile(
      path.join(site, "docs/.vitepress/shared/security.md"),
      "utf8",
    ),
    /\[Deploy\]\(\/deploy\/index\)/,
  );
  const target = path.join(site, "docs/releases/v0.10.0.md");
  assert.match(
    await readFile(target, "utf8"),
    /\[imports\]\(\/guide\/imports\)/,
  );
  await writeFile(target, "A stale copy\n");
  const result = run("--check");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /docs\/releases\/v0.10.0.md/);
  assert.equal(await readFile(target, "utf8"), "A stale copy\n");
  assert.equal(run().status, 0);
  await writeFile(
    path.join(source, "docs/releases/v0.11.0.md"),
    "# New release\n",
  );
  assert.equal(run("--check").status, 1);
  assert.equal(run().status, 0);
  assert.match(
    await readFile(path.join(site, "docs/releases/index.md"), "utf8"),
    /v0.11.0/,
  );
  assert.equal(
    await readFile(handwritten, "utf8"),
    "Keep this handwritten page.\n",
  );
});

test("missing canonical sections fail before changing generated output", async (t) => {
  const { site, source, run } = await fixture(t);
  assert.equal(run().status, 0);
  const target = path.join(site, "docs/.vitepress/shared/setup.md");
  const before = await readFile(target, "utf8");
  await writeFile(
    path.join(source, "CONTRIBUTING.md"),
    "## Getting set up\n\nChanged\n",
  );
  assert.notEqual(run().status, 0);
  assert.equal(await readFile(target, "utf8"), before);
});
