const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("DataSync", async function () {
  it("LocationEfs", () =>
    pipe([
      () => ({
        groupType: "DataSync::LocationEfs",
        livesNotFound: ({ config }) => [
          {
            LocationArn: `arn:aws:datasync:${
              config.region
            }:${config.accountId()}:location/loc-026c1169c918b0fd9`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("LocationFsxLustre", () =>
    pipe([
      () => ({
        groupType: "DataSync::LocationFsxLustre",
        livesNotFound: ({ config }) => [
          {
            LocationArn: `arn:aws:datasync:${
              config.region
            }:${config.accountId()}:location/loc-026c1169c918b0fd9`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("LocationFsxOpenZfs", () =>
    pipe([
      () => ({
        groupType: "DataSync::LocationFsxOpenZfs",
        livesNotFound: ({ config }) => [
          {
            LocationArn: `arn:aws:datasync:${
              config.region
            }:${config.accountId()}:location/loc-026c1169c918b0fd9`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("LocationFsxWindows", () =>
    pipe([
      () => ({
        groupType: "DataSync::LocationFsxWindows",
        livesNotFound: ({ config }) => [
          {
            LocationArn: `arn:aws:datasync:${
              config.region
            }:${config.accountId()}:location/loc-026c1169c918b0fd9`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("LocationS3", () =>
    pipe([
      () => ({
        groupType: "DataSync::LocationS3",
        livesNotFound: ({ config }) => [
          {
            LocationArn: `arn:aws:datasync:${
              config.region
            }:${config.accountId()}:location/loc-026c1169c918b0fd9`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Task", () =>
    pipe([
      () => ({
        groupType: "DataSync::Task",
        livesNotFound: ({ config }) => [
          {
            TaskArn: `arn:aws:datasync:${
              config.region
            }:${config.accountId()}:task/task-072ca67ac80607381`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
