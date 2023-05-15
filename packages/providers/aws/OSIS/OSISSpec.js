const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OSIS.html

const { OSISPipeline } = require("./OSISPipeline");

const GROUP = "OSIS";

const tagsKey = "tags";
const compare = compareAws({ tagsKey, key: "key" });

module.exports = pipe([
  () => [
    //
    OSISPipeline({}),
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
