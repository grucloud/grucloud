const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { AutoScaling } = require("@aws-sdk/client-auto-scaling");
const { createEndpoint } = require("../AwsCommon");

exports.createAutoScaling = createEndpoint(AutoScaling);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#createOrUpdateTags-property
exports.tagResource =
  ({ autoScaling, ResourceType }) =>
  ({ id }) =>
    pipe([
      map(defaultsDeep({ ResourceType, ResourceId: id })),
      (Tags) => ({ Tags }),
      autoScaling().createOrUpdateTags,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#deleteTags-property
exports.untagResource =
  ({ autoScaling, ResourceType }) =>
  ({ id }) =>
    pipe([
      map((Key) => ({ Key, ResourceType, ResourceId: id })),
      (Tags) => ({ Tags }),
      autoScaling().deleteTags,
    ]);
