const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");
const { PipesPipe } = require("./PipesPipe");

const GROUP = "Pipes";
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Pipes.html
module.exports = pipe([
  () => [
    //
    PipesPipe({}),
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
