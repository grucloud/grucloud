const assert = require("assert");
const { pipe, omit, tap, assign } = require("rubico");
const { callProp } = require("rubico/x");

const { createEndpoint } = require("../AwsCommon");

exports.createApiGatewayV2 = createEndpoint("apigatewayv2", "ApiGatewayV2");

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

exports.findDependenciesApi = ({ live, lives }) => ({
  type: "Api",
  group: "ApiGatewayV2",
  ids: [live.ApiId],
});

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
