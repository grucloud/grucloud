const assert = require("assert");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs").promises;
const constants = require("fs");

const { pipe, tap, switchCase, tryCatch, eq, get } = require("rubico");
const { callProp } = require("rubico/x");

const { DockerClient } = require("../src/docker");

const containerImage = "grucloud-cli";
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

const promisifyWsClient = (stream) =>
  new Promise((resolve, reject) => {
    stream.on("close", () => {
      resolve();
    });
    stream.on("error", reject);
  });

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

        const resultGet = await docker.container.get({ id: result.Id });
        assert(resultGet.State.Status);
      }
      // Start
      {
        const startParam = {
          name: containerName,
          //body: { output: "/dev/null" },
        };
        await docker.container.start(startParam);
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
        const stream = await docker.container.log(logParam);
        stream.on("data", (data) => {
          console.log(data.toString());
        });

        await promisifyWsClient(stream);
      }
      // Delete
      {
        const deleteParam = {
          name: containerName,
        };
        const result = await docker.container.delete(deleteParam);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});
