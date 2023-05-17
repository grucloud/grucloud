const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("RolesAnywhere", async function () {
  it("CRL", () =>
    pipe([
      () => ({
        groupType: "RolesAnywhere::CRL",
        livesNotFound: ({ config }) => [
          {
            crlId: "8e404ea1-csye-ptqx-tiqy-r1ujif70lq3p",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Profile", () =>
    pipe([
      () => ({
        groupType: "RolesAnywhere::Profile",
        livesNotFound: ({ config }) => [
          {
            profileId: "8e404ea1-csye-ptqx-tiqy-r1ujif70lq3p",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("TrustAnchor", () =>
    pipe([
      () => ({
        groupType: "RolesAnywhere::TrustAnchor",
        livesNotFound: ({ config }) => [
          {
            trustAnchorId: "8e404ea1-csye-ptqx-tiqy-r1ujif70lq3p",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
