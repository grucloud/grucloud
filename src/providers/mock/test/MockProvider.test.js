const assert = require("assert");
const MockCloud = require("../MockCloud");
const createStack = require("./MockStack");

const logger = require("logger")({ prefix: "MockProviderTest" });
const toJSON = (x) => JSON.stringify(x, null, 4);

const mockCloudInitStates = [
  [
    "Ip",
    [
      [
        "51.15.246.48",
        {
          address: "51.15.246.48",
        },
      ],
    ],
  ],
  ["Image", [["1", { name: "Ubuntu", arch: "x86_64" }]]],
  ["Volume", []],
  ["Server", []],
];

describe("MockProvider", function () {
  const { provider, ip, volume, server, image } = createStack({
    config: MockCloud(mockCloudInitStates),
  });
  it("ip config", async function () {
    const config = await ip.config();
    assert(config);
  });
  it("image config", async function () {
    const config = await image.config();
    assert(config);
  });
  it("volume config", async function () {
    const config = await volume.config();
    assert(config);
  });
  it("server config", async function () {
    const config = await server.config();
    assert(config);
    //console.log(config);
    assert(config.name);
    assert.equal(config.boot_type, "local");
    assert(config.image);
    assert(config.volumes);
  });

  it("list config", async function () {
    const configs = await provider.listConfig();
    assert(configs);
  });
});
