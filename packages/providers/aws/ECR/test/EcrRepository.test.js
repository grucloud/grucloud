const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe } = require("rubico");

describe("EcrRepository", async function () {
  let config;
  let provider;
  let repository;

  before(async function () {
    provider = AwsProvider({ config });
    repository = provider.getClient({
      groupType: "ECR::Repository",
    });
    await provider.start();
  });
  it(
    "delete with invalid id",
    pipe([
      () =>
        repository.destroy({
          live: { repositoryName: "12345" },
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        repository.getByName({
          name: "124",
        }),
    ])
  );
});
