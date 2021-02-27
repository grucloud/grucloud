const assert = require("assert");
const { pipe } = require("rubico");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("ConfigLoader");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");
const { fetchThumbprint } = require("../AwsIamOpenIDConnectProvider");

describe("AwsIamOpenIDConnectProvider", async function () {
  let config;
  let provider;
  let iamOpenIdConnectProvider;
  const types = ["IamOpenIDConnectProvider"];
  const oidcUrl =
    "https://oidc.eks.eu-west-2.amazonaws.com/id/E4E702DA316D71C017B623B18414E97C";
  const iamOpenIdConnectProviderName = "oidc-eks";

  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({
      config: config.aws,
    });

    await provider.start();

    iamOpenIdConnectProvider = await provider.makeIamOpenIDConnectProvider({
      name: iamOpenIdConnectProviderName,
      properties: () => ({
        Url: oidcUrl,
        ClientIDList: ["sts.amazonaws.com"],
      }),
    });
  });
  after(async () => {});
  it("fetchThumbprint", async function () {
    return pipe([
      () => fetchThumbprint({ Url: oidcUrl }),
      (result) => {
        assert(result);
      },
    ])();
  });
  it("iamOpenIdConnectProvider resolveConfig", async function () {
    assert.equal(iamOpenIdConnectProvider.name, iamOpenIdConnectProviderName);
    const config = await iamOpenIdConnectProvider.resolveConfig();
  });
  it("iamOpenIdConnectProvider apply plan", async function () {
    await testPlanDeploy({
      provider,
      types,
      planResult: { create: 1, destroy: 0 },
    });

    const iamOpenIdConnectProviderLive = await iamOpenIdConnectProvider.getLive();
    assert(iamOpenIdConnectProviderLive);
    await testPlanDestroy({ provider, types });
  });
});
