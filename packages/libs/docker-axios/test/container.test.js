const assert = require("assert");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs").promises;
const constants = require("fs");

const { pipe, tap, switchCase, tryCatch, eq, get } = require("rubico");
const { callProp } = require("rubico/x");

const { DockerClient } = require("../src/docker");

const containerImage = "grucloud-aws";
const outputGcList = "gc-list.json";
const localVolume = "volume";

const localVolumePath = path.resolve(localVolume);
const outputGcListLocalPath = path.resolve(localVolumePath, outputGcList);

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

describe("container", function () {
  before(async () => {
    assert(true);
  });
  after(async () => {});

  it("containerList", async () => {
    const docker = DockerClient({});
    try {
      await docker.container.list();
    } catch (error) {
      throw error;
    }

    assert(true);
  });
  it("create, list, start, wait, delete", async () => {
    try {
      const docker = DockerClient({});

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
      // Logs
      {
        const logParam = {
          name: containerName,
          options: {
            stdout: 1,
            stderr: 1,
            //tail: 100,
            //follow: 0,
          },
        };
        const result = await docker.container.log(logParam);
        console.log(result);
      }
      // Delete
      {
        const deleteParam = {
          name: containerName,
        };
        const result = await docker.container.delete(deleteParam);
        assert(true);
      }
    } catch (error) {
      throw error;
    }
  });
  it.skip("create with no env", async () => {
    try {
      const docker = DockerClient({});

      // Create
      const containerName = `${containerImage}-${uuidv4()}`;
      {
        const createParam = {
          name: containerName,
          body: {
            Image: containerImage,
            Cmd: ["list", "--json", `output/${outputGcList}`],
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

      // Wait
      {
        const waitParam = {
          name: containerName,
        };
        const result = await docker.container.wait(waitParam);
        assert.equal(result.StatusCode, 0);
      }
      // Logs
      {
        const logParam = {
          name: containerName,
          options: {
            stdout: 1,
            stderr: 1,
            //tail: 100,
            //follow: 0,
          },
        };
        const result = await docker.container.log(logParam);
        console.log(result);
      }
      // Delete
      {
        const result = await docker.container.delete({
          name: containerName,
        });
        assert(true);
      }
    } catch (error) {
      throw error;
    }
  });
});
