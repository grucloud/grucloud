const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Evidently.html

//const { EvidentlyFeature } = require("./EvidentlyFeature");
//const { EvidentlyProject } = require("./EvidentlyProject");
//const { EvidentlySegment } = require("./EvidentlySegment");

const GROUP = "Evidently";
const tagsKey = "tag";
const compare = compareAws({ tagsKey, key: "key" });

module.exports = pipe([
  () => [
    // EvidentlyFeature({})
    // EvidentlyProject({})
    // EvidentlySegment({})
  ],
  map(createAwsService),
  map(
    defaultsDeep({
      group: GROUP,
      tagsKey,
      compare: compare({}),
    })
  ),
]);
