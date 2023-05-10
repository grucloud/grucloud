const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ResilienceHub.html

const { ResilienceHubApp } = require("./ResilienceHubApp");
const {
  ResilienceHubResiliencyPolicy,
} = require("./ResilienceHubResiliencyPolicy");

const GROUP = "ResilienceHub";

const tagsKey = "tags";
const compare = compareAws({ tagsKey, key: "key" });

module.exports = pipe([
  () => [
    //
    ResilienceHubApp({}),
    ResilienceHubResiliencyPolicy({}),
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
