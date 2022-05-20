const assert = require("assert");
const { pipe, tap, tryCatch } = require("rubico");
const os = require("os");
const prompts = require("prompts");
const path = require("path");
const { createProject } = require("../createProject");
const fs = require("fs").promises;

assert(process.env.AZURE_SUBSCRIPTION_ID);

const runProject = ({ injects }) =>
  tryCatch(
    pipe([
      tap(() => prompts.inject(injects)),
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

describe("createProject", function () {
  before(async function () {
    if (process.env.CONTINUOUS_INTEGRATION) {
      this.skip();
    }
  });
  it("createProject aws", async function () {
    await runProject({ injects: ["aws", "aws-project-test", "us-east-1"] });
  });
  it("createProject azure", async function () {
    await runProject({
      injects: [
        "azure",
        "azure-project-test",
        process.env.AZURE_SUBSCRIPTION_ID,
        "sp-test",
        "canadacentral",
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
