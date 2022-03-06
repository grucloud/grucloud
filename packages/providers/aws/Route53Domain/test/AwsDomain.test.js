const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");

describe("AwsDomain", async function () {
  let config;
  let provider;
  let domain;

  const types = ["Domain"];
  const domainName = "grucloud.org";

  const createProvider = async ({ config }) => {
    const provider = AwsProvider({
      config: () => ({}),
    });

    domain = provider.Route53Domains.useDomain({
      name: domainName,
    });

    await provider.start();

    return provider;
  };
  before(async function () {
    provider = await createProvider({ config });
  });
  after(async () => {});
});
