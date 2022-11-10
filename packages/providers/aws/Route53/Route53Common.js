const assert = require("assert");
const { pipe, tap } = require("rubico");
const { callProp, when, append } = require("rubico/x");
const { createEndpoint } = require("../AwsCommon");
const { createTagger } = require("../AwsTagger");

exports.createRoute53 = createEndpoint("route-53", "Route53");

exports.hostedZoneIdToResourceId = callProp("replace", "/hostedzone/", "");

exports.buildRecordName = ({ Name, Type, SetIdentifier }) =>
  pipe([
    tap(() => {
      assert(Name);
      assert(Type);
    }),
    () => `record::${Type}::${Name}`,
    when(() => SetIdentifier, append(`::${SetIdentifier}`)),
  ])();

//TODO ResourceType
exports.Tagger = createTagger({
  methodTagResource: "changeTagsForResource",
  methodUnTagResource: "changeTagsForResource",
  ResourceArn: "ResourceId",
  TagsKey: "AddTags",
  UnTagsKey: "RemoveTagKeys",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#changeTagsForResource-property
exports.tagResource =
  ({ ResourceType }) =>
  ({ endpoint }) =>
  ({ id }) =>
    pipe([
      (AddTags) => ({ ResourceId: id, AddTags, ResourceType }),
      endpoint().changeTagsForResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#changeTagsForResource-property
exports.untagResource =
  ({ ResourceType }) =>
  ({ endpoint }) =>
  ({ id }) =>
    pipe([
      (RemoveTagKeys) => ({ ResourceId: id, RemoveTagKeys, ResourceType }),
      endpoint().changeTagsForResource,
    ]);
