const assert = require("assert");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs").promises;
const constants = require("fs");

const { pipe, tap, switchCase, tryCatch, eq, get } = require("rubico");
const { callProp } = require("rubico/x");

const { DockerClient } = require("../src/docker");

const getEnv = ({ fileName = "aws.env" }) =>
  pipe([
    () => fs.readFile(fileName, "utf8"), //
    callProp("split", "\n"),
  ])();

const fileExist = ({ fileName }) =>
  tryCatch(
    pipe([() => fs.access(fileName, constants.R_OK), () => true]),
    pipe([
      tap((error) => {
        assert(true);
      }),
      () => false,
    ])
  )();

describe("DockerClient", function () {
  before(async () => {
    assert(true);
  });
  after(async () => {});

  it("containerList", async () => {
    const docker = DockerClient({});
    await docker.containerList();
    assert(true);
  });
  it("create, list, start, wait, delete", async () => {
    const docker = DockerClient({});
    const containerImage = "grucloud-aws";
    const outputGcList = "gc-list.json";
    const localVolume = "volume";
    const localVolumePath = path.resolve(localVolume);
    const outputGcListLocalPath = path.resolve(localVolumePath, outputGcList);
    try {
      fs.unlink(outputGcListLocalPath);
    } catch (error) {
      assert(true);
    }
    // Create
    const containerName = `${containerImage}-${uuidv4()}`;
    {
      const createParam = {
        name: containerName,
        body: {
          Image: containerImage,
          Cmd: ["list", "--json", `output/${outputGcList}`],
          Env: await getEnv({}),
          HostConfig: {
            Binds: [`${localVolumePath}:/app/output`],
          },
        },
      };
      const result = await docker.container.create(createParam);
      assert(result.Id);
    }
    // Start
    {
      const startParam = {
        name: containerName,
        //body: { output: "/dev/null" },
      };
      const result = await docker.container.start(startParam);
      assert(true);
    }
    // List
    {
      const result = await docker.container.list({
        filters: `{"name": ["${containerName}"]}`,
      });
      assert.equal(result.length, 1);
    }
    // Wait
    {
      const waitParam = {
        name: containerName,
      };
      const result = await docker.container.wait(waitParam);
      assert.equal(result.StatusCode, 0);
      assert(
        await fileExist({
          fileName: outputGcListLocalPath,
        })
      );
    }
    // Delete
    {
      const deleteParam = {
        name: containerName,
      };
      const result = await docker.container.delete(deleteParam);
      assert(true);
    }
  });
});
