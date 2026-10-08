import test from "node:test";
import assert from "node:assert/strict";
import { checkCoverage } from "./check-published-releases.mjs";

const releases = [
  [{ tag_name: "v0.1.0", draft: false }],
  [
    { tag_name: "v0.4.0", draft: false },
    { tag_name: "v0.8.0-rc.1", draft: false, prerelease: true },
    { tag_name: "v0.9.0", draft: true },
  ],
];
const complete = ["v0.1.0", "v0.4.0", "v0.8.0-rc.1"];

test("checks every published page, including prereleases across API pages, but excludes drafts", () => {
  assert.equal(
    checkCoverage(releases, {
      app: complete,
      site: complete,
      navigation: complete,
      index: complete,
    }),
    3,
  );
});

test("reports missing historical notes and missing navigation or index entries", () => {
  assert.throws(
    () =>
      checkCoverage(releases, {
        app: complete.filter((tag) => tag !== "v0.1.0"),
        site: complete.filter((tag) => tag !== "v0.4.0"),
        navigation: ["v0.4.0", "v0.8.0-rc.1"],
        index: ["v0.1.0", "v0.8.0-rc.1"],
      }),
    (error) => {
      for (const message of [
        "v0.1.0: missing from app",
        "v0.4.0: missing from site",
        "v0.1.0: missing from navigation",
        "v0.4.0: missing from index",
      ])
        assert.ok(error.message.includes(message));
      return true;
    },
  );
});

test("rejects malformed API data rather than passing an incomplete response", () => {
  for (const value of [
    { message: "API failure" },
    [null],
    [{ draft: false }],
    [{ tag_name: "v0.1.0" }],
  ]) {
    assert.throws(() => checkCoverage(value, { site: complete }));
  }
});
