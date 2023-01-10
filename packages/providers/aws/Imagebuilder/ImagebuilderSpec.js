const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ImageBuilder.html
const { ImagebuilderComponent } = require("./ImagebuilderComponent");
const {
  ImagebuilderContainerRecipe,
} = require("./ImagebuilderContainerRecipe");

const {
  ImagebuilderDistributionConfiguration,
} = require("./ImagebuilderDistributionConfiguration");

const { ImagebuilderImageRecipe } = require("./ImagebuilderImageRecipe");
const { ImagebuilderImage } = require("./ImagebuilderImage");

const { ImagebuilderImagePipeline } = require("./ImagebuilderImagePipeline");

const {
  ImagebuilderInfrastructureConfiguration,
} = require("./ImagebuilderInfrastructureConfiguration");

const GROUP = "Imagebuilder";
const tagsKey = "tags";
const compare = compareAws({ tagsKey, key: "key" });

module.exports = pipe([
  () => [
    ImagebuilderComponent({}),
    ImagebuilderContainerRecipe({}),
    ImagebuilderDistributionConfiguration({}),
    ImagebuilderImage({}),
    ImagebuilderImagePipeline({}),
    ImagebuilderImageRecipe({}),
    ImagebuilderInfrastructureConfiguration({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        tagsKey,
        compare: compare({}),
      }),
    ])
  ),
]);
