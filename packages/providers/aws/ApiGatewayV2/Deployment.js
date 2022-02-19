const assert = require("assert");
const { pipe, tap, get, eq, filter, pick } = require("rubico");
const { pluck, defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { shouldRetryOnException } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const findId = get("live.DeploymentId");
const pickId = pick(["ApiId", "DeploymentId"]);
const findName = pipe([
  get("live"),
  tap((params) => {
    assert(true);
  }),
  tap(({ ApiName }) => {
    assert(ApiName);
  }),
  //TODO Stage ?
  ({ ApiName }) => `deployment::${ApiName}`,
  tap((params) => {
    assert(true);
  }),
]);

exports.Deployment = ({ spec, config }) => {
  const client = AwsClient({ spec, config });

  const findDependencies = ({ live, lives }) => [
    {
      type: "Api",
      group: "ApiGatewayV2",
      ids: [live.ApiId],
    },
    {
      type: "Stage",
      group: "ApiGatewayV2",
      ids: pipe([
        () =>
          lives.getByType({
            providerName: config.providerName,
            type: "Stage",
            group: "ApiGatewayV2",
          }),
        filter(eq(get("live.DeploymentId"), live.DeploymentId)),
        pluck("id"),
      ])(),
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getDeployment-property
  const getById = client.getById({
    pickId,
    method: "getDeployment",
    ignoreErrorCodes: ["NotFoundException"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getDeployments-property
  const getList = client.getListWithParent({
    parent: { type: "Api", group: "ApiGatewayV2" },
    pickKey: pipe([pick(["ApiId"])]),
    method: "getDeployments",
    getParam: "Items",
    config,
    decorate: ({ parent: { ApiId, Name: ApiName, Tags } }) =>
      pipe([
        tap((params) => {
          assert(ApiName);
        }),
        defaultsDeep({ ApiId, ApiName, Tags }),
      ]),
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createDeployment-property
  const create = client.create({
    method: "createDeployment",
    pickCreated:
      ({ payload }) =>
      (result) =>
        pipe([() => result, defaultsDeep({ ApiId: payload.ApiId })])(),
    pickId,
    getById,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#updateDeployment-property
  const update = client.update({
    pickId,
    method: "updateDeployment",
    getById,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#deleteDeployment-property
  const destroy = client.destroy({
    pickId,
    method: "deleteDeployment",
    getById,
    ignoreErrorCodes: ["NotFoundException", "BadRequestException"],
    config,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { api, stage },
  }) =>
    pipe([
      tap(() => {
        assert(api, "missing 'api' dependency");
      }),
      () => otherProps,
      defaultsDeep({
        ApiId: getField(api, "ApiId"),
        //TODO is StageName required ?
        StageName: getField(stage, "StageName"),
      }),
    ])();

  return {
    spec,
    findName,
    findId,
    create,
    update,
    destroy,
    getByName,
    getById,
    getList,
    configDefault,
    shouldRetryOnException,
    findDependencies,
  };
};
