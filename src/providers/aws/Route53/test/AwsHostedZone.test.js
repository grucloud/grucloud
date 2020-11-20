const assert = require("assert");
const { find } = require("rubico/x");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("ConfigLoader");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");

describe("AwsHostedZone", async function () {
  let config;
  let provider;
  let hostedZone;
  const types = ["HostedZone"];
  let hostedZoneEmpty;
  const hostedZoneName = "aws.grucloud.com";

  const createProvider = async ({ config }) => {
    const provider = AwsProvider({
      name: "aws",
      config: config.aws,
    });

    await provider.start();

    hostedZone = await provider.makeHostedZone({
      name: `${hostedZoneName}.`,
      properties: () => ({
        RecordSet: [
          {
            Name: `${hostedZoneName}.`,
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
      name: "aws-empty.grucloud.com.",
      properties: () => ({}),
    });

    return provider;
  };
  const createProviderNext = async ({ config }) => {
    const provider = AwsProvider({
      name: "aws",
      config: config.aws,
    });

    await provider.start();

    hostedZone = await provider.makeHostedZone({
      name: `${hostedZoneName}.`,
      properties: () => ({
        RecordSet: [
          {
            Name: "_0bc9df9e6752c379559a2f41be63ff04.aws.grucloud.com.",
            ResourceRecords: [
              {
                Value:
                  "_ebff683f9ce743915b12f5a2105c9108.wggjkglgrm.acm-validations.aws.",
              },
            ],
            TTL: 60,
            Type: "CNAME",
          },
        ],
      }),
    });
    return provider;
  };
  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = await createProvider({ config });
  });
  after(async () => {});
  it("hostedZone resolveConfig", async function () {
    assert.equal(hostedZone.name, `${hostedZoneName}.`);
    const config = await hostedZone.resolveConfig();
    assert.equal(config.Name, `${hostedZoneName}.`);
  });

  it("hostedZone apply plan", async function () {
    await testPlanDeploy({
      provider,
      types,
      planResult: { create: 2, destroy: 0 },
    });

    const hostedZoneLive = await hostedZone.getLive();
    assert(hostedZoneLive);
    assert(find((record) => record.Type === "A")(hostedZoneLive.RecordSet));

    const providerNext = await createProviderNext({ config });

    const plan = await providerNext.planQuery();
    assert.equal(plan.resultDestroy.plans.length, 1);
    assert.equal(plan.resultCreate.plans.length, 1);
    const update = plan.resultCreate.plans[0];
    assert.equal(update.action, "UPDATE");
    assert.equal(update.diff.additions[0].Type, "CNAME");
    assert.equal(update.diff.deletions[0].Type, "A");
    const {
      error,
      resultCreate,
      resultDestroy,
    } = await providerNext.planApply({ plan });
    assert(!error);
    assert.equal(resultCreate.results.length, 1);
    assert.equal(resultDestroy.results.length, 1);

    await testPlanDestroy({ provider, types });
  });
});
