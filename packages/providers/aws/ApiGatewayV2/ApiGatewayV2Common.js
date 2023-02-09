const assert = require("assert");
const { pipe, omit, tap, assign, get } = require("rubico");
const { callProp } = require("rubico/x");

const { createEndpoint } = require("../AwsCommon");

exports.createApiGatewayV2 = createEndpoint("apigatewayv2", "ApiGatewayV2");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceArn",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

exports.managedByOther = () =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    get("ApiGatewayManaged"),
  ]);

exports.dependencyIdApi =
  ({ lives, config }) =>
  (live) =>
    `arn:aws:execute-api:${config.region}:${config.accountId()}:${live.ApiId}`;

exports.ignoreErrorCodes = ["NotFoundException"];

exports.buildPayloadDescriptionTags = pipe([
  tap((params) => {
    assert(true);
  }),
  assign({
    Description: pipe([
      ({ Description = "", Tags }) =>
        `${Description} tags:${JSON.stringify(Tags)}`,
      callProp("trim"),
    ]),
  }),
  omit(["Tags"]),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#tagResource-property
exports.tagResource =
  ({ buildResourceArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (Tags) => ({ ResourceArn: buildResourceArn(live), Tags }),
      endpoint().tagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#untagResource-property
exports.untagResource =
  ({ buildResourceArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (TagKeys) => ({ ResourceArn: buildResourceArn(live), TagKeys }),
      endpoint().untagResource,
    ]);
