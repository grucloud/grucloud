const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("ConfigLoader");

describe("AwsDomain", async function () {
  let config;
  let provider;
  let domain;

  const types = ["Domain"];
  const domainName = "grucloud.org";

  const createProvider = async ({ config }) => {
    const provider = AwsProvider({
      config: { ...config.aws, region: "us-east-1", zone: "us-east-1a" },
    });

    await provider.start();

    domain = await provider.useRoute53Domain({
      name: domainName,
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
  it("Domain resolveConfig", async function () {
    assert.equal(domain.name, domainName);
    const config = await domain.resolveConfig();
    assert.equal(config.DomainName, domainName);
  });

  it("Domain apply plan", async function () {
    const domainLive = await domain.getLive();
    assert(domainLive);
    assert(domainLive.Nameservers);
  });
});
