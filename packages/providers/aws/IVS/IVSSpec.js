const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IVS.html

const { IVSChannel } = require("./IVSChannel");
const { IVSPlaybackKeyPair } = require("./IVSPlaybackKeyPair");
const { IVSRecordingConfiguration } = require("./IVSRecordingConfiguration");

const GROUP = "IVS";
const tagsKey = "tags";

const compare = compareAws({ tagsKey, key: "key" });

module.exports = pipe([
  () => [
    //
    IVSChannel({}),
    IVSPlaybackKeyPair({}),
    IVSRecordingConfiguration({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
      }),
    ])
  ),
]);
