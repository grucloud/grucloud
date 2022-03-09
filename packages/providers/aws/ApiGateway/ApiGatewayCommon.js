const assert = require("assert");
const { pipe, omit, tap, assign, fork, map, get } = require("rubico");
const { callProp, values, flatten, isEmpty, unless } = require("rubico/x");

const { APIGateway } = require("@aws-sdk/client-api-gateway");
const { createEndpoint } = require("../AwsCommon");

exports.createAPIGateway = createEndpoint(APIGateway);

exports.ignoreErrorCodes = ["NotFoundException"];

exports.findDependenciesRestApi = ({ live, lives }) => ({
  type: "RestApi",
  group: "APIGateway",
  ids: [live.restApiId],
});

exports.buildPayloadDescriptionTags = pipe([
  tap((params) => {
    assert(true);
  }),
  assign({
    description: pipe([
      ({ Description = "", Tags }) =>
        `${Description} tags:${JSON.stringify(Tags)}`,
      callProp("trim"),
    ]),
  }),
  omit(["tags"]),
]);

exports.diffToPatch = ({ diff }) =>
  pipe([
    () => diff,
    fork({
      add: pipe([
        get("liveDiff.added", {}),
        map.entries(([key, value]) => [
          key,
          { op: "replace", path: `/${key}`, value },
        ]),
        values,
      ]),
      replace: pipe([
        get("liveDiff.updated", {}),
        map.entries(([key, value]) => [
          key,
          { op: "replace", path: `/${key}`, value: `${value.toString()}` },
        ]),
        values,
      ]),
    }),
    values,
    flatten,
  ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#tagResource-property
exports.tagResource =
  ({ apiGateway, buildResourceArn }) =>
  ({ live }) =>
    pipe([
      (tags) => ({ resourceArn: buildResourceArn(live), tags }),
      apiGateway().tagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#untagResource-property
exports.untagResource =
  ({ apiGateway, buildResourceArn }) =>
  ({ live }) =>
    pipe([
      (tagKeys) => ({
        resourceArn: buildResourceArn(live),
        tagKeys,
      }),
      apiGateway().untagResource,
    ]);
