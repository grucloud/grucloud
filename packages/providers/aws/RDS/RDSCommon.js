const assert = require("assert");
const { pipe, tap, assign, omit, get, eq, or } = require("rubico");
const { find, when, callProp } = require("rubico/x");
const { createTagger } = require("../AwsTagger");

const { createEndpoint } = require("../AwsCommon");

exports.createRDS = createEndpoint("rds", "RDS");

const isAuroraEngine = pipe([get("Engine"), callProp("startsWith", "aurora")]);
exports.isAuroraEngine = isAuroraEngine;

const isNeptune = pipe([get("Engine"), callProp("startsWith", "neptune")]);
exports.isNeptune = isNeptune;

exports.omitAllocatedStorage = pipe([
  when(or([isAuroraEngine, isNeptune]), omit(["AllocatedStorage"])),
]);

exports.omitUsernamePassword = when(
  isNeptune,
  omit(["MasterUsername", "MasterUserPassword"])
);

exports.Tagger = createTagger({
  methodTagResource: "addTagsToResource",
  methodUnTagResource: "removeTagsFromResource",
  ResourceArn: "ResourceName",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#addTagsToResource-property
exports.tagResource =
  ({ endpoint }) =>
  ({ id }) =>
    pipe([
      (Tags) => ({ ResourceName: id, Tags }),
      endpoint().addTagsToResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#removeTagsFromResource-property
exports.untagResource =
  ({ endpoint }) =>
  ({ id }) =>
    pipe([
      (TagKeys) => ({ ResourceName: id, TagKeys }),
      endpoint().removeTagsFromResource,
    ]);

exports.renameTagList = pipe([
  assign({ Tags: get("TagList") }),
  omit(["TagList"]),
]);

exports.findDependenciesSecret =
  ({ secretField, rdsUsernameField }) =>
  ({ lives, config }) =>
  (live) =>
    pipe([
      lives.getByType({
        type: "Secret",
        group: "SecretsManager",
        providerName: config.providerName,
      }),
      find(eq(get(`live.SecretString.${secretField}`), live[rdsUsernameField])),
    ])();
