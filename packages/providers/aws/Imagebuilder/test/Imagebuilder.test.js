const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Imagebuilder", async function () {
  it("Component", () =>
    pipe([
      () => ({
        groupType: "Imagebuilder::Component",
        livesNotFound: ({ config }) => [
          {
            arn: `arn:${config.partition}:imagebuilder:${
              config.region
            }:${config.accountId()}:component/myimportedcomponent/1.0.0/1`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("ContainerRecipe", () =>
    pipe([
      () => ({
        groupType: "Imagebuilder::ContainerRecipe",
        livesNotFound: ({ config }) => [
          {
            arn: `arn:${config.partition}:imagebuilder:${
              config.region
            }:${config.accountId()}:container-recipe/my-repo/1.0.0`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("DistributionConfiguration", () =>
    pipe([
      () => ({
        groupType: "Imagebuilder::DistributionConfiguration",
        livesNotFound: ({ config }) => [
          {
            arn: `arn:${config.partition}:imagebuilder:${
              config.region
            }:${config.accountId()}:distribution-configuration/my-pipeline-46d4672f-d8ff-49d5-9474-a961f4b4f72a`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Image", () =>
    pipe([
      () => ({
        groupType: "Imagebuilder::Image",
        livesNotFound: ({ config }) => [
          {
            arn: `arn:${config.partition}:imagebuilder:${
              config.region
            }:${config.accountId()}:image/-9e6pj-a4i-yio-suowxez4wnse94ma0mxledfuw-b8sfoo2d/9582574101122192693379095400736515105.x.x`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("ImagePipeline", () =>
    pipe([
      () => ({
        groupType: "Imagebuilder::ImagePipeline",
        livesNotFound: ({ config }) => [
          {
            arn: `arn:${config.partition}:imagebuilder:${
              config.region
            }:${config.accountId()}:image-pipeline/my-pipeline-ko`,
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
            arn: `arn:${config.partition}:imagebuilder:${
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
            arn: `arn:${config.partition}:imagebuilder:${
              config.region
            }:${config.accountId()}:infrastructure-configuration/my-pipeline-46d4672f-d8ff-49d5-9474-a961f4b4f72a`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
