const assert = require("assert");
const { pipe, tap, tryCatch } = require("rubico");
const os = require("os");
const prompts = require("prompts");
const path = require("path");
const { createProject } = require("../createProject");
const fs = require("fs").promises;

describe("createProject", function () {
  it("createProject aws", async function () {
    await tryCatch(
      pipe([
        tap(() => prompts.inject(["aws", "aws-project-test"])),
        () => fs.mkdtemp(path.join(os.tmpdir(), "gc-")),
        (tempPath) =>
          createProject({
            programOptions: {
              workingDirectory: tempPath,
            },
          })({}),
      ]),
      (error) => {
        throw error;
      }
    )();
  });
  it("createProject azure", async function () {
    await tryCatch(
      pipe([
        tap(() => prompts.inject(["azure", "azure-project-test"])),
        () => fs.mkdtemp(path.join(os.tmpdir(), "gc-")),
        (tempPath) =>
          createProject({
            programOptions: {
              workingDirectory: tempPath,
            },
          })({}),
      ]),
      (error) => {
        throw error;
      }
    )();
  });
  it("createProject gcp", async function () {
    await tryCatch(
      pipe([
        tap(() => {
          prompts.inject(["google", "google-project-test", "grucloud-test"]);
        }),
        () => fs.mkdtemp(path.join(os.tmpdir(), "gc-")),
        (tempPath) =>
          createProject({
            programOptions: {
              workingDirectory: tempPath,
            },
          })({}),
      ]),
      (error) => {
        throw error;
      }
    )();
  });
});
