const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const GROUP = "ElasticTranscoder";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

//const { ElasticTranscoderPipeline } = require("./ElasticTranscoderPipeline");

module.exports = pipe([
  () => [
    //
    // ElasticTranscoderPipeline({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
        tagsKey,
      }),
    ])
  ),
]);
