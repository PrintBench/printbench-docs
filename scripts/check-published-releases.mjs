import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function checkCoverage(releases, locations) {
  if (!Array.isArray(releases))
    throw new Error("Expected a JSON array of GitHub releases");
  const published = releases.flat().filter((release) => {
    if (
      !release ||
      typeof release.tag_name !== "string" ||
      typeof release.draft !== "boolean"
    ) {
      throw new Error("Invalid GitHub release metadata");
    }
    return !release.draft;
  });
  const missing = [];
  for (const { tag_name: tag } of published) {
    for (const [location, tags] of Object.entries(locations)) {
      if (!tags.includes(tag)) missing.push(`${tag}: missing from ${location}`);
    }
  }
  if (missing.length)
    throw new Error(
      `Published release history is incomplete:\n${missing.join("\n")}\nBackfill the app notes, run docs:sync and commit the docs update.`,
    );
  return published.length;
}

async function main() {
  const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  let source = path.resolve(site, "../printbench");
  let releasesFile;
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--source" && args[i + 1]) source = path.resolve(args[++i]);
    else if (args[i] === "--releases" && args[i + 1])
      releasesFile = path.resolve(args[++i]);
    else throw new Error(`Unknown or incomplete argument: ${args[i]}`);
  }
  if (!releasesFile)
    throw new Error(
      "Pass --releases <GitHub releases JSON>. See README.md for the gh api command.",
    );
  const releases = JSON.parse(await readFile(releasesFile, "utf8"));
  const tags = (files) =>
    files
      .filter((file) => file.endsWith(".md"))
      .map((file) => file.slice(0, -3));
  const navigation = JSON.parse(
    await readFile(path.join(site, "docs/.vitepress/releases.json"), "utf8"),
  );
  const index = await readFile(
    path.join(site, "docs/releases/index.md"),
    "utf8",
  );
  const count = checkCoverage(releases, {
    "app release notes": tags(
      await readdir(path.join(source, "docs/releases")),
    ),
    "site release notes": tags(await readdir(path.join(site, "docs/releases"))),
    "release navigation": navigation.map(({ text }) => text),
    "release index": [
      ...index.matchAll(/\[([^\]]+)\]\(\/releases\/[^)]+\)/g),
    ].map((match) => match[1]),
  });
  console.log(
    `All ${count} published GitHub releases have app notes, site notes, navigation and index entries.`,
  );
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
