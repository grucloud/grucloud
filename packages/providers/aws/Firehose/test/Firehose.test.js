const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Firehose", async function () {
  it("DeliveryStream", () =>
    pipe([
      () => ({
        groupType: "Firehose::DeliveryStream",
        livesNotFound: ({ config }) => [
          {
            DeliveryStreamName: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
