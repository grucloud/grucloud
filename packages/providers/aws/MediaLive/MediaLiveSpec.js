const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html

const { MediaLiveChannel } = require("./MediaLiveChannel");
const { MediaLiveInput } = require("./MediaLiveInput");
const {
  MediaLiveInputSecurityGroup,
} = require("./MediaLiveInputSecurityGroup");
const { MediaLiveMultiplex } = require("./MediaLiveMultiplex");
const { MediaLiveMultiplexProgram } = require("./MediaLiveMultiplexProgram");

const GROUP = "MediaLive";

const compare = compareAws({});

module.exports = pipe([
  () => [
    MediaLiveChannel({}),
    MediaLiveInput({}),
    MediaLiveInputSecurityGroup({}),
    MediaLiveMultiplex({}),
    MediaLiveMultiplexProgram({}),
  ],
  map(createAwsService),
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
    })
  ),
]);
