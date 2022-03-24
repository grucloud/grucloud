const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { tryCatch, pipe, tap } = require("rubico");

describe("SNS Topic", async function () {
  let config;
  let provider;
  let topic;

  before(async function () {
    provider = AwsProvider({ config });
    topic = provider.getClient({ groupType: "SNS::Topic" });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => topic.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        topic.destroy({
          live: {
            Attributes: {
              TopicArn: "arn:aws:sns:us-east-1:840541460064:idnonotexist",
            },
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        topic.getById({
          Attributes: {
            TopicArn: "arn:aws:sns:us-east-1:840541460064:idnonotexist",
          },
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        topic.getByName({
          name: "idnonotexist",
        }),
    ])
  );
});
