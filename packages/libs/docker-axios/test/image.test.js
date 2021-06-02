const assert = require("assert");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs").promises;
const constants = require("fs");

const { pipe, tap, switchCase, tryCatch, eq, get } = require("rubico");
const { callProp } = require("rubico/x");

const { DockerClient } = require("../src/docker");

const containerImage = "grucloud-aws";

describe("DockerClient Image", function () {
  before(async () => {
    assert(true);
  });
  after(async () => {});

  it("image pull", async () => {
    const docker = DockerClient({});
    try {
      await docker.image.pull({ image: "fredericheem/grucloud-cli:v1.17.8" });
    } catch (error) {
      throw error;
    }

    assert(true);
  });
});
