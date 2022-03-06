const assert = require("assert");
const { find } = require("rubico/x");
const { AwsProvider } = require("../../AwsProvider");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");
const { Cli } = require("@grucloud/core/cli/cliCommands");

describe.skip("Route53HostedZone", async function () {
  let config;
  const types = ["HostedZone"];
  const domainName = "grucloud.org";
  const subDomainName = `sub.${domainName}`;

  const createStack = async ({ config }) => {
    const provider = AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });

    const domain = provider.Route53Domains.useDomain({
      name: domainName,
    });

    const hostedZone = provider.Route53.makeHostedZone({
      name: `${subDomainName}.`,
      dependencies: { domain },
      properties: () => ({}),
    });

    const recordA = provider.Route53.makeRecord({
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

    const recordNS = provider.Route53.makeRecord({
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

    return { provider, resources: { domain, hostedZone, recordA, recordNS } };
  };

  const createStackNext = async ({ config }) => {
    const provider = AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });

    const domain = provider.Route53Domains.useDomain({
      name: domainName,
    });

    const hostedZone = provider.Route53.makeHostedZone({
      name: `${subDomainName}.`,
      dependencies: { domain },
      properties: () => ({}),
    });

    const recordA = provider.Route53.makeRecord({
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
    return { provider, resources: { domain, hostedZone, recordA } };
  };
  before(async function () {});
  after(async () => {});

  it("hostedZone apply plan", async function () {
    const {
      provider,
      resources: { hostedZone },
    } = await createStack({ config });

    await testPlanDeploy({
      provider,
      types,
      planResult: { create: 3, destroy: 0 },
    });

    const { provider: providerNext } = await createStackNext({ config });

    const cli = await Cli({
      createStack: () => ({
        provider: providerNext,
      }),
    });

    const { error, resultQuery } = await cli.planQuery({
      commandOptions: {},
    });

    assert(!error);
    const plan = resultQuery.results[0];
    //assert.equal(plan.resultDestroy.length, 1);
    //assert.equal(plan.resultCreate.length, 2);
    const updateHostedZone = plan.resultCreate[0];
    assert.equal(updateHostedZone.action, "UPDATE");
    assert(updateHostedZone.diff.liveDiff.updated.ResourceRecords);

    //const updateRecord = plan.resultCreate[1];
    //assert.equal(updateRecord.action, "UPDATE");
    //assert(updateRecord.diff.updated.ResourceRecords);
    {
      const result = await cli.planApply({
        commandOptions: { force: true },
      });
      assert(!result.error);
      // assert.equal(
      //   result.resultDeploy.results[0].resultCreate.results.length,
      //   2
      // );
    }
    await testPlanDestroy({ provider: providerNext, types });
  });
});
