const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, when, append, find } = require("rubico/x");

const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const {
  createApiGatewayV2,
  ignoreErrorCodes,
  tagResource,
  untagResource,
} = require("./ApiGatewayCommon");

exports.Stage = ({ spec, config }) => {
  const apiGateway = createApiGatewayV2(config);
  const client = AwsClient({ spec, config })(apiGateway);

  const buildResourceArn = ({ ApiId, StageName }) =>
    `arn:aws:apigateway:${config.region}::/apis/${ApiId}/stages/${StageName}`;

  const findId = () => pipe([buildResourceArn]);

  const findName =
    ({ lives, config }) =>
    (live) =>
      pipe([
        tap(() => {
          assert(live.ApiId);
          assert(live.StageName);
        }),
        lives.getByType({
          type: "Api",
          group: "ApiGatewayV2",
          providerName: config.providerName,
        }),
        find(eq(get("live.ApiId"), live.ApiId)),
        get("name"),
        tap((name) => {
          assert(name);
        }),
        append(`::${live.StageName}`),
      ])();

  const pickId = pick(["ApiId", "StageName"]);

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
    decorate: ({ parent: { ApiId } }) => pipe([defaultsDeep({ ApiId })]),
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
    tagResource: tagResource({ buildResourceArn })({ endpoint: apiGateway }),
    untagResource: untagResource({ buildResourceArn })({
      endpoint: apiGateway,
    }),
  };
};
