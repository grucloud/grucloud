const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const {
  createApiGatewayV2,
  findDependenciesApi,
  ignoreErrorCodes,
  tagResource,
  untagResource,
} = require("./ApiGatewayCommon");

const findId = get("live.StageName");
const findName = get("live.StageName");

const pickId = pick(["ApiId", "StageName"]);

exports.Stage = ({ spec, config }) => {
  const apiGateway = createApiGatewayV2(config);
  const client = AwsClient({ spec, config })(apiGateway);

  const findDependencies = ({ live, lives }) => [
    findDependenciesApi({ live }),
    {
      type: "LogGroup",
      group: "CloudWatchLogs",
      ids: [pipe([() => live, get("AccessLogSettings.DestinationArn")])()],
    },
  ];

  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getStage-property
  const getById = client.getById({
    pickId,
    method: "getStage",
    ignoreErrorCodes,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getStages-property
  const getList = client.getListWithParent({
    parent: { type: "Api", group: "ApiGatewayV2" },
    pickKey: pipe([pick(["ApiId"])]),
    method: "getStages",
    getParam: "Items",
    config,
    decorate: ({ parent: { ApiId } }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        defaultsDeep({ ApiId }),
      ]),
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createStage-property
  const create = client.create({
    method: "createStage",
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#updateStage-property
  const update = client.update({
    pickId,
    method: "updateStage",
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#deleteStage-property
  const destroy = client.destroy({
    pickId,
    method: "deleteStage",
    getById,
    ignoreErrorCodes,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { api, logGroup },
  }) =>
    pipe([
      tap(() => {
        assert(api, "missing 'api' dependency");
      }),
      () => otherProps,
      defaultsDeep({
        StageName: name,
        ApiId: getField(api, "ApiId"),
        Tags: buildTagsObject({ config, namespace, userTags: Tags }),
      }),
      tap((params) => {
        assert(true);
      }),
      when(
        () => logGroup,
        defaultsDeep({
          AccessLogSettings: {
            DestinationArn: getField(logGroup, "arn"),
            Format:
              '$context.identity.sourceIp - - [$context.requestTime] "$context.httpMethod $context.routeKey $context.protocol" $context.status $context.responseLength $context.requestId',
          },
        })
      ),
    ])();

  const buildResourceArn = ({ ApiId, StageName }) =>
    `arn:aws:apigateway:${config.region}::/apis/${ApiId}/stages/${StageName}`;

  return {
    spec,
    findName,
    findId,
    create,
    update,
    destroy,
    getById,
    getByName,
    getList,
    configDefault,
    findDependencies,
    tagResource: tagResource({ apiGateway, buildResourceArn }),
    untagResource: untagResource({ apiGateway, buildResourceArn }),
  };
};
