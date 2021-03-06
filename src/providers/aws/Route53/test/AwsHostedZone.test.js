const assert = require("assert");
const { find } = require("rubico/x");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("ConfigLoader");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");

describe("AwsHostedZone", async function () {
  let config;
  let provider;
  let hostedZone;
  let recordA;
  const types = ["HostedZone"];
  const domainName = "grucloud.org";
  const subDomainName = `sub.${domainName}`;
  const configUsEast = (config) => ({
    ...config.aws,
    region: "us-east-1",
    zone: "us-east-1a",
  });
  const createProvider = async ({ config }) => {
    const provider = AwsProvider({
      config: configUsEast(config),
    });

    await provider.start();

    domain = await provider.useRoute53Domain({
      name: domainName,
    });

    hostedZone = await provider.makeHostedZone({
      name: `${subDomainName}.`,
      dependencies: { domain },
      properties: () => ({}),
    });

    recordA = await provider.makeRoute53Record({
      name: `${subDomainName}.`,
      dependencies: { hostedZone },
      properties: () => ({
        ResourceRecords: [
          {
            Value: "192.0.2.44",
          },
        ],
        TTL: 60,
        Type: "A",
      }),
    });

    recordNS = await provider.makeRoute53Record({
      name: `validation.${subDomainName}.`,
      dependencies: { hostedZone },
      properties: () => ({
        Name: `1234567890.${subDomainName}.`,
        ResourceRecords: [
          {
            Value: "ns-1139.awsdns-14.org.",
          },
        ],
        TTL: 60,
        Type: "NS",
      }),
    });

    return provider;
  };
  const createProviderNext = async ({ config }) => {
    const provider = AwsProvider({
      config: configUsEast(config),
    });

    await provider.start();

    hostedZone = await provider.makeHostedZone({
      name: `${subDomainName}.`,
      dependencies: { domain },
      properties: () => ({}),
    });

    recordA = await provider.makeRoute53Record({
      name: `${subDomainName}.`,
      dependencies: { hostedZone },
      properties: () => ({
        ResourceRecords: [
          {
            Value: "192.0.2.45",
          },
        ],
        TTL: 60,
        Type: "A",
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
    assert.equal(hostedZone.name, `${subDomainName}.`);
    const config = await hostedZone.resolveConfig();
    assert.equal(config.Name, `${subDomainName}.`);
  });

  it("hostedZone apply plan", async function () {
    await testPlanDeploy({
      provider,
      types,
      planResult: { create: 3, destroy: 0 },
    });

    const hostedZoneLive = await hostedZone.getLive();
    assert(hostedZoneLive);
    assert(find((record) => record.Type === "A")(hostedZoneLive.RecordSet));

    const providerNext = await createProviderNext({ config });

    const plan = await providerNext.planQuery();
    //assert.equal(plan.resultDestroy.length, 1);
    assert.equal(plan.resultCreate.length, 2);
    const updateHostedZone = plan.resultCreate[0];
    assert.equal(updateHostedZone.action, "UPDATE");
    assert.equal(updateHostedZone.diff.deletions.length, 1);

    const updateRecord = plan.resultCreate[1];
    assert.equal(updateRecord.action, "UPDATE");
    assert(updateRecord.diff.updated.ResourceRecords);

    const {
      error,
      resultCreate,
      resultDestroy,
    } = await providerNext.planApply({ plan });
    assert(!error);
    assert.equal(resultCreate.results.length, 2);
    //assert.equal(resultDestroy.results.length, 1);

    await testPlanDestroy({ provider, types });
  });
});
