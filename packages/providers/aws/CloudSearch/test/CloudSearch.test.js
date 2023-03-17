const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CloudSearch", async function () {
  it.skip("Domain", () =>
    pipe([
      () => ({
        groupType: "CloudSearch::Domain",
        livesNotFound: ({ config }) => [
          {
            DomainName: "d123.com",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("ServiceAccessPolicy", () =>
    pipe([
      () => ({
        groupType: "CloudSearch::DomainServiceAccessPolicy",
        livesNotFound: ({ config }) => [
          {
            ChannelArn: "uuid",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
