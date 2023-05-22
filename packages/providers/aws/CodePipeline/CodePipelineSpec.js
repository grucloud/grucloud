const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const {
  CodePipelineCustomActionType,
} = require("./CodePipelineCustomActionType");
const { CodePipelinePipeline } = require("./CodePipelinePipeline");
const { CodePipelineWebhook } = require("./CodePipelineWebhook");

const GROUP = "CodePipeline";
const tagsKey = "tags";
const compare = compareAws({ tagsKey, key: "key" });

module.exports = pipe([
  () => [
    //
    CodePipelineCustomActionType({}),
    CodePipelinePipeline({}),
    CodePipelineWebhook({}),
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
