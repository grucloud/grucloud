const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ResourceExplorer2.html

const { ResourceExplorer2Index } = require("./ResourceExplorer2Index");
const { ResourceExplorer2View } = require("./ResourceExplorer2View");

const GROUP = "ResourceExplorer2";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

module.exports = pipe([
  () => [
    //
    ResourceExplorer2Index({}),
    ResourceExplorer2View({}),
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
