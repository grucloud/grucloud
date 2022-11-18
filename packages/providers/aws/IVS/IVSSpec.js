const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IVS.html

//const { IVSChannel } = require("./IVSChannel");
//const { IVSPlaybackKeyPair } = require("./IVSPlaybackKeyPair");
//const { IVSRecordingConfiguration } = require("./IVSRecordingConfiguration");
//const { IVSStreamKey} = require("./IVSStreamKey");

const GROUP = "IVS";

const compare = compareAws({});

module.exports = pipe([
  () => [
    // IVSChannel({})
    // IVSPlaybackKeyPair({})
    // IVSRecordingConfiguration({})
    // IVSStreamKey({})
  ],
  map(createAwsService),
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
    })
  ),
]);
