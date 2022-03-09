const { pipe, tap } = require("rubico");
const { callProp } = require("rubico/x");
const { Route53 } = require("@aws-sdk/client-route-53");
const { createEndpoint } = require("../AwsCommon");

exports.createRoute53 = createEndpoint(Route53);

exports.hostedZoneIdToResourceId = callProp("replace", "/hostedzone/", "");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#changeTagsForResource-property
exports.tagResource =
  ({ route53, ResourceType }) =>
  ({ id }) =>
    pipe([
      (AddTags) => ({ ResourceId: id, AddTags, ResourceType }),
      route53().changeTagsForResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#changeTagsForResource-property
exports.untagResource =
  ({ route53, ResourceType }) =>
  ({ id }) =>
    pipe([
      (RemoveTagKeys) => ({ ResourceId: id, RemoveTagKeys, ResourceType }),
      route53().changeTagsForResource,
    ]);
