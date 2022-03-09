const assert = require("assert");
const { SSM } = require("@aws-sdk/client-ssm");
const { pipe, tap, get } = require("rubico");
const { unless, isEmpty } = require("rubico/x");

const { createEndpoint } = require("../AwsCommon");

exports.createSSM = createEndpoint(SSM);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#addTagsToResource-property
exports.tagResource =
  ({ ssm, ResourceType }) =>
  ({ diff, id }) =>
    pipe([
      () => diff,
      get("tags.targetTags"),
      pipe([
        (Tags) => ({ ResourceId: id, Tags, ResourceType }),
        ssm().addTagsToResource,
      ]),
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#removeTagsFromResource-property
exports.untagResource =
  ({ ssm, ResourceType }) =>
  ({ diff, id }) =>
    pipe([
      () => diff,
      get("tags.removedKeys"),
      unless(
        isEmpty,
        pipe([
          (TagKeys) => ({ ResourceId: id, TagKeys, ResourceType }),
          ssm().removeTagsFromResource,
        ])
      ),
    ]);
