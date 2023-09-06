const assert = require("assert");
const { pipe, tap, tryCatch } = require("rubico");
const os = require("os");
const prompts = require("prompts");
const path = require("path");
const { createProject } = require("../createProject");
const fs = require("fs").promises;

assert(process.env.AZURE_SUBSCRIPTION_ID);

const runProject = ({ injects, commandOptions = {} }) =>
  tryCatch(
    pipe([
      tap(() => prompts.inject(injects)),
      () => fs.mkdtemp(path.join(os.tmpdir(), "gc-")),
      (tempPath) =>
        createProject({
          programOptions: {
            workingDirectory: tempPath,
          },
        })(commandOptions),
    ]),
    (error) => {
      throw error;
    }
  )();

describe("createProject", function () {
  before(async function () {
    if (process.env.CONTINUOUS_INTEGRATION) {
      this.skip();
    }
  });
  it("createProject aws", async function () {
    await runProject({
      injects: ["aws", "aws-project-test", "aws", "default", "us-east-1"],
    });
  });
  it("createProject aws wrong profile", async function () {
    try {
      await runProject({
        commandOptions: {},
        injects: ["aws", "aws-project-test", "aws", "wrong-profile"],
      });
      assert(false, "shoud not be here");
    } catch (error) {
      assert(
        error.includes("The config profile (wrong-profile) could not be found")
      );
    }
  });
  it("createProject azure", async function () {
    await runProject({
      injects: [
        "azure",
        "azure-project-test",
        process.env.AZURE_SUBSCRIPTION_ID,
        "sp-test",
        "uksouth",
      ],
    });
  });
  it("createProject gcp", async function () {
    await runProject({
      injects: [
        "google",
        "google-project-test",
        "grucloud-test",
        "us-central1",
        "us-central1-a",
      ],
    });
  });
  it("createProject k8s", async function () {
    await runProject({
      injects: ["k8s", "my-k8s-project"],
    });
  });
});
