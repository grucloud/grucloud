const assert = require("assert");
const { tryCatch, pipe, tap } = require("rubico");
const { AwsProvider } = require("../../AwsProvider");

describe("AwsCertificate", async function () {
  let provider;
  let certificate;

  before(async function () {
    provider = AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });
    await provider.start();
    certificate = provider.getClient({ groupType: "ACM::Certificate" });
  });
  it(
    "certificate getById not found",
    pipe([
      () =>
        certificate.getById({
          id: "arn:aws:acm:us-east-1:840541460064:certificate/1ef2da5d-bcf6-4dcd-94c1-1532a8d64eff",
        }),
    ])
  );
  it(
    "certificate destroy not found",
    pipe([
      () =>
        certificate.destroy({
          live: {
            CertificateArn:
              "arn:aws:acm:us-east-1:840541460064:certificate/1ef2da5d-bcf6-4dcd-94c1-1532a8d64eff",
          },
        }),
    ])
  );
});
