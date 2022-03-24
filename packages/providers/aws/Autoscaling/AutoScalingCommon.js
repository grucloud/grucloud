const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createEndpoint } = require("../AwsCommon");

exports.createAutoScaling = createEndpoint("auto-scaling", "AutoScaling");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#createOrUpdateTags-property
exports.tagResource =
  ({ autoScaling, ResourceType, property }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(live);
      }),
      map(
        defaultsDeep({
          PropagateAtLaunch: false,
          ResourceType,
          ResourceId: live[property],
        })
      ),
      tap((params) => {
        assert(true);
      }),
      (Tags) => ({ Tags }),
      autoScaling().createOrUpdateTags,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#deleteTags-property
exports.untagResource =
  ({ autoScaling, ResourceType, property }) =>
  ({ live }) =>
    pipe([
      map((Key) => ({
        Key,
        ResourceType,
        ResourceId: live[property],
      })),
      (Tags) => ({ Tags }),
      autoScaling().deleteTags,
    ]);
