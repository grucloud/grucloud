const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Rekognition", async function () {
  it("Collection", () =>
    pipe([
      () => ({
        groupType: "Rekognition::Collection",
        livesNotFound: ({ config }) => [{ CollectionId: "c1234567" }],
      }),
      awsResourceTest,
    ])());
  it("Project", () =>
    pipe([
      () => ({
        groupType: "Rekognition::Project",
        livesNotFound: ({ config }) => [
          {
            ProjectName: "p1234",
            ProjectArn: `arn:${config.partition}:rekognition:${
              config.region
            }:${config.accountId()}:project/qnzC51EnBACHk3oTTh.oTB9WxH2eMHE/762093524950321420860781117375238604510212472218043533303676583042196901597683897`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("StreamProcessor", () =>
    pipe([
      () => ({
        groupType: "Rekognition::StreamProcessor",
        livesNotFound: ({ config }) => [
          {
            Name: "s123",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
