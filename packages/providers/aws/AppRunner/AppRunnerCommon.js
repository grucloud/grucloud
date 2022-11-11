const { pipe, get, tryCatch, assign } = require("rubico");

const { createEndpoint } = require("../AwsCommon");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceArn",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

exports.createAppRunner = createEndpoint("apprunner", "AppRunner");

exports.ignoreErrorCodes = ["ResourceNotFoundException"];

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#tagResource-property
exports.tagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (Tags) => ({ ResourceArn: buildArn(live), Tags }),
      endpoint().tagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#untagResource-property
exports.untagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (TagKeys) => ({ ResourceArn: buildArn(live), TagKeys }),
      endpoint().untagResource,
    ]);

exports.assignTags = ({ endpoint, buildArn }) =>
  pipe([
    assign({
      Tags: tryCatch(
        pipe([
          buildArn,
          (ResourceArn) => ({
            ResourceArn,
          }),
          endpoint().listTagsForResource,
          get("Tags"),
        ]),
        (error) => undefined
      ),
    }),
  ]);
