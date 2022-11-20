const assert = require("assert");
const { pipe, tap, get, assign, filter, eq, pick, and } = require("rubico");
const { defaultsDeep, find } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const { createApiGatewayV2, ignoreErrorCodes } = require("./ApiGatewayCommon");

const findId = () => get("ApiMappingId");

const findName = () =>
  pipe([
    tap(({ DomainName, ApiName, Stage, ApiMappingKey }) => {
      assert(DomainName);
      assert(Stage);
      assert(ApiName);
    }),
    ({ DomainName, ApiName, Stage, ApiMappingKey }) =>
      `apimapping::${DomainName}::${ApiName}::${Stage}::${ApiMappingKey}`,
  ]);

const pickId = pick(["ApiMappingId", "DomainName"]);

exports.ApiMapping = ({ spec, config }) => {
  const apiGateway = createApiGatewayV2(config);
  const client = AwsClient({ spec, config })(apiGateway);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getApiMapping-property
  const getById = client.getById({
    pickId,
    method: "getApiMapping",
    ignoreErrorCodes,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getApiMappings-property
  const getList = client.getListWithParent({
    parent: { type: "DomainName", group: "ApiGatewayV2" },
    pickKey: pick(["DomainName"]),
    method: "getApiMappings",
    getParam: "Items",
    config,
    decorate:
      ({ lives, parent: { DomainName, Tags } }) =>
      (live) =>
        pipe([
          () => live,
          defaultsDeep({ DomainName }),
          assign({
            ApiName: pipe([
              ({ ApiId }) =>
                lives.getById({
                  id: `arn:aws:execute-api:${
                    config.region
                  }:${config.accountId()}:${ApiId}`,
                  providerName: config.providerName,
                  type: "Api",
                  group: "ApiGatewayV2",
                }),
              get("name"),
            ]),
          }),
        ])(),
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createApiMapping-property
  const create = client.create({
    method: "createApiMapping",
    pickCreated: ({ payload }) =>
      pipe([defaultsDeep({ DomainName: payload.DomainName })]),
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#updateApiMapping-property
  const update = client.update({
    pickId,
    method: "updateApiMapping",
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#deleteApiMapping-property
  const destroy = client.destroy({
    pickId,
    method: "deleteApiMapping",
    getById,
    ignoreErrorCodes,
  });

  const configDefault = ({
    name,
    namespace,
    properties,
    dependencies: { stage, domainName },
  }) =>
    pipe([
      tap(() => {
        assert(domainName, "missing 'domainName' dependency");
        assert(stage, "missing 'stage' dependency");
      }),
      () => properties,
      defaultsDeep({
        ApiId: getField(stage, "ApiId"),
        DomainName: getField(domainName, "DomainName"),
        Stage: getField(stage, "StageName"),
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
  };
};
