const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe.only("Imagebuilder", async function () {
  it.skip("Component", () =>
    pipe([
      () => ({
        groupType: "Imagebuilder::Component",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ContainerRecipe", () =>
    pipe([
      () => ({
        groupType: "Imagebuilder::ContainerRecipe",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("DistributionConfiguration", () =>
    pipe([
      () => ({
        groupType: "Imagebuilder::DistributionConfiguration",
        livesNotFound: ({ config }) => [
          {
            arn: `arn:aws:imagebuilder:${
              config.region
            }:${config.accountId()}:distribution-configuration/my-pipeline-46d4672f-d8ff-49d5-9474-a961f4b4f72a`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("Image", () =>
    pipe([
      () => ({
        groupType: "Imagebuilder::Image",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("ImagePipeline", () =>
    pipe([
      () => ({
        groupType: "Imagebuilder::ImagePipeline",
        livesNotFound: ({ config }) => [
          {
            arn: `arn:aws:imagebuilder:${
              config.region
            }:${config.accountId()}:distribution-configuration/image-pipeline/my-pipeline-ko`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("ImageRecipe", () =>
    pipe([
      () => ({
        groupType: "Imagebuilder::ImageRecipe",
        livesNotFound: ({ config }) => [
          {
            arn: `arn:aws:imagebuilder:${
              config.region
            }:${config.accountId()}:image-recipe/my-recipe/1.0.0`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("InfrastructureConfiguration", () =>
    pipe([
      () => ({
        groupType: "Imagebuilder::InfrastructureConfiguration",
        livesNotFound: ({ config }) => [
          {
            arn: `arn:aws:imagebuilder:${
              config.region
            }:${config.accountId()}:infrastructure-configuration/my-pipeline-46d4672f-d8ff-49d5-9474-a961f4b4f72a`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
