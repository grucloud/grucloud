const assert = require("assert");
const { pipe, tap } = require("rubico");
const { AwsProvider } = require("../../AwsProvider");

describe("AppRunner Service", async function () {
  let provider;
  let service;

  before(async function () {
    provider = AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });
    await provider.start();
    service = provider.getClient({ groupType: "AppRunner::Service" });
  });
  it(
    "list",
    pipe([
      () => service.getList({}),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "getById not found",
    pipe([
      () =>
        service.getById({
          ServiceArn:
            "arn:aws:apprunner:us-east-1:840541460064:service/mock-server/4d97761b3685416bb95d7debd86ca5a8",
        }),
    ])
  );
  it(
    "destroy not found",
    pipe([
      () =>
        service.destroy({
          live: {
            ServiceArn:
              "arn:aws:apprunner:us-east-1:840541460064:service/mock-server/4d97761b3685416bb95d7debd86ca5a8",
          },
        }),
    ])
  );
});
