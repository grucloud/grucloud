const assert = require("assert");
const { pipe, tap } = require("rubico");
const { callProp } = require("rubico/x");
const { createEndpoint } = require("../AwsCommon");

exports.createRoute53 = createEndpoint("route-53", "Route53");

exports.hostedZoneIdToResourceId = callProp("replace", "/hostedzone/", "");

exports.buildRecordName = pipe([
  tap(({ Name, Type }) => {
    assert(Name);
    assert(Type);
  }),
  ({ Name, Type }) => `record::${Name}::${Type}`,
]);

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
