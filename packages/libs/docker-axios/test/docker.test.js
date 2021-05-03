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
  it.only("containerCreate", async () => {
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
      const result = await docker.containerCreate(createParam);
      assert(result.Id);
    }
    {
      const startParam = {
        name: containerName,
        body: { output: "/dev/null" },
      };
      const result = await docker.containerStart(startParam);
      assert(true);
    }
    {
      const result = await docker.containerList({
        filters: `{"name": ["${containerName}"]}`,
      });
      assert.equal(result.length, 1);
    }
    {
      const waitParam = {
        name: containerName,
      };
      const result = await docker.containerWait(waitParam);
      assert.equal(result.StatusCode, 0);
      assert(
        await fileExist({
          fileName: outputGcListLocalPath,
        })
      );
    }
  });
});
