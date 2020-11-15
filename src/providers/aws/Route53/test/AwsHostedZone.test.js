const assert = require("assert");
const { find } = require("rubico/x");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("ConfigLoader");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");

describe("AwsHostedZone", async function () {
  let config;
  let provider;
  let hostedZone;
  let hostedZoneEmpty;
  const hostedZoneName = "aws.grucloud.com";

  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({
      name: "aws",
      config: config.aws,
    });

    await provider.start();

    const { error } = await provider.destroyAll();
    assert(!error, "destroyAll failed");

    hostedZone = await provider.makeHostedZone({
      name: hostedZoneName,
      properties: () => ({
        RecordSet: [
          {
            Name: hostedZoneName,
            ResourceRecords: [
              {
                Value: "192.0.2.44",
              },
            ],
            TTL: 60,
            Type: "A",
          },
        ],
      }),
    });
    hostedZoneEmpty = await provider.makeHostedZone({
      name: "aws-empty.grucloud.com",
      properties: () => ({}),
    });
  });
  after(async () => {
    //await provider?.destroyAll();
  });
  it("hostedZone resolveConfig", async function () {
    assert.equal(hostedZone.name, hostedZoneName);
    const config = await hostedZone.resolveConfig();
    assert.equal(config.Name, hostedZoneName);
  });
  it("hostedZone plan", async function () {
    const plan = await provider.planQuery();
    assert.equal(plan.resultDestroy.plans.length, 0);
    assert.equal(plan.resultCreate.plans.length, 2);
  });
  it("hostedZone listLives all", async function () {
    const { results: lives } = await provider.listLives({
      types: ["HostedZone"],
    });
    assert(lives);
  });

  it("hostedZone apply plan", async function () {
    await testPlanDeploy({ provider, types: ["HostedZone"] });

    const hostedZoneLive = await hostedZone.getLive();
    assert(hostedZoneLive);
    assert(find((record) => record.Type === "A")(hostedZoneLive.RecordSet));
    await testPlanDestroy({ provider });
  });
});
