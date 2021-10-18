const assert = require("assert");
const os = require("os");
const prompts = require("prompts");
const path = require("path");
const { createProject } = require("../createProject");

describe("createProject", function () {
  it("createProject aws", async function () {
    try {
      prompts.inject(["aws", "aws-project-test"]);

      await createProject({
        programOptions: {
          workingDirectory: fs.mkdtemp(path.join(os.tmpdir(), "gc-")),
        },
      })({});
    } catch (error) {
      throw error;
    }
  });
});
