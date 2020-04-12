const assert = require("assert");
const GoogleProvider = require("./GoogleProvider");

const GruCloud = require("../../GruCloudApp");

const config = {
  project: "starhackit",
  region: "europe-west4",
  zone: "europe-west4-a",
};

describe.skip("GoogleProvider", function () {
  const provider = GoogleProvider({ name: "google" }, config);

  const volume = provider.makeVolume({ name: "volume1" }, () => ({
    size: 20000000000,
  }));

  const server = provider.makeServer(
    {
      name: "web-server",
      dependencies: { volume },
    },
    async ({ dependencies: { volume } }) => ({
      name: "web-server",
      commercial_type: "DEV1-S",
      //image: await image.config(),
      volumes: {
        "0": await volume.config(),
      },
    })
  );

  const infra = {
    providers: [provider],
    resources: [volume, server],
  };

  it("engineByType", async function () {
    //const server = provider.engineByType("compute");
    //assert(server);
  });
  it("plan", async function () {
    const gc = GruCloud(infra);
    const plan = await gc.plan();
    console.log(JSON.stringify(plan, null, 4));
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 1);
  });

  it("list, ", async function () {
    const response = await server.client.list({});
    assert(response);
  });

  it("list, create, list, delete, list", async function () {
    const listB4 = await server.client.list();

    const name = `vm-test-${new Date().getTime()}`;

    await server.create(name, webResourceConfig);

    const vm = await server.client.get(name);

    //console.log("listAfterCreation", vm);
    const { metadata } = vm;
    assert(metadata.machineType.endsWith(webResourceConfig.machineType));
    assert.equal(metadata.status, "RUNNING");

    await server.client.destroy(name);
    const listAfterDestroy = await server.client.list();
    //console.log("listAfterDestroy", listAfterDestroy);
    assert.equal(listB4.length, listAfterDestroy.length);
  });
  it.skip("create", async function () {
    const name = `vm-test-${new Date().getTime()}`;
    await server.create(name, webResourceConfig);
  });
});
