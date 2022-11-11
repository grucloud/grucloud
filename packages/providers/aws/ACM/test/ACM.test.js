const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("ACM", async function () {
  it("Certificate", () =>
    pipe([
      () => ({
        groupType: "ACM::Certificate",
        livesNotFound: ({ config }) => [
          {
            CertificateArn: `arn:aws:acm:us-east-1:${config.accountId()}:certificate/1ef2da5d-bcf6-4dcd-94c1-1532a8d64eff`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
