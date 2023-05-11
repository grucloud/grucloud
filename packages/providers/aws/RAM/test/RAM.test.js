const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("RAM", async function () {
  it("Permission", () =>
    pipe([
      () => ({
        groupType: "RAM::Permission",
        livesNotFound: ({ config }) => [
          {
            permissionArn: `arn:aws:ram:${
              config.region
            }:${config.accountId()}:permission/e4b6b5bd-74db-4776-9967-dc13aa3b2807`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("PrincipalAssociation", () =>
    pipe([
      () => ({
        groupType: "RAM::PrincipalAssociation",
        livesNotFound: ({ config }) => [
          {
            resourceShareArn: `arn:aws:ram:${
              config.region
            }:${config.accountId()}:resource-share/e4b6b5bd-74db-4776-9967-dc13aa3b2807`,
            associatedEntity: "123456789012",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("ResourceAssociation", () =>
    pipe([
      () => ({
        groupType: "RAM::ResourceAssociation",
        livesNotFound: ({ config }) => [
          {
            resourceShareArn: `arn:aws:ram:${
              config.region
            }:${config.accountId()}:resource-share/e4b6b5bd-74db-4776-9967-dc13aa3b2807`,
            associatedEntity: `arn:aws:ec2:${
              config.region
            }:${config.accountId()}:subnet/subnet-02635c742ca4543ba`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("ResourceShare", () =>
    pipe([
      () => ({
        groupType: "RAM::ResourceShare",
        livesNotFound: ({ config }) => [
          {
            resourceShareArn: `arn:aws:ram:${
              config.region
            }:${config.accountId()}:resource-share/e4b6b5bd-74db-4776-9967-dc13aa3b2807`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
