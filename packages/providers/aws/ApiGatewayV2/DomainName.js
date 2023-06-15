const assert = require("assert");
const { pipe, tap, get, pick, eq, omit, assign, map, and } = require("rubico");
const { defaultsDeep, pluck, when, first } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

const { Tagger, ignoreErrorCodes } = require("./ApiGatewayV2Common");

const buildArn =
  ({ config }) =>
  ({ DomainName }) =>
    `arn:${config.partition}:apigateway:${config.region}::/domainnames/${DomainName}`;

const pickId = pipe([
  tap(({ DomainName }) => {
    assert(DomainName);
  }),
  pick(["DomainName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html
exports.ApiGatewayV2DomainName = () => ({
  type: "DomainName",
  package: "apigatewayv2",
  client: "ApiGatewayV2",
  propertiesDefault: {},
  inferName: () => get("DomainName"),
  findName: () => get("DomainName"),
  findId: () => get("DomainName"),
  ignoreErrorCodes,
  propertiesDefault: {
    ApiMappingSelectionExpression: "$request.basepath",
  },
  omitProperties: [
    "DomainNameConfigurations[].ApiGatewayDomainName",
    "DomainNameConfigurations[].DomainNameStatus",
    "DomainNameConfigurations[].EndpointType",
    "DomainNameConfigurations[].HostedZoneId",
    "DomainNameConfigurations[].SecurityPolicy",
  ],
  filterLive: ({ providerConfig, lives }) =>
    pipe([
      when(
        eq(get("ApiMappingSelectionExpression"), "$request.basepath"),
        omit(["ApiMappingSelectionExpression"])
      ),
      assign({
        DomainNameConfigurations: pipe([
          get("DomainNameConfigurations"),
          map(
            assign({
              CertificateArn: pipe([
                get("CertificateArn"),
                replaceWithName({
                  groupType: "ACM::Certificate",
                  path: "id",
                  providerConfig,
                  lives,
                }),
              ]),
            })
          ),
        ]),
      }),
    ]),
  dependencies: {
    certificates: {
      type: "Certificate",
      group: "ACM",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("DomainNameConfigurations"), pluck("CertificateArn")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getDomainName-property
  getById: {
    method: "getDomainName",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#listDomainNames-property
  getList: {
    method: "getDomainNames",
    getParam: "Items",
    decorate: ({ getById }) => getById,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createDomainName-property
  create: {
    method: "createDomainName",
    shouldRetryOnExceptionCodes: [
      "UnsupportedCertificate",
      "BadRequestException",
    ],
    isInstanceUp: pipe([
      get("DomainNameConfigurations"),
      first,
      and([get("HostedZoneId"), get("ApiGatewayDomainName")]),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#updateDomainName-property
  // update: {
  //   method: "updateDomainName",
  //   filterParams: ({ payload, diff, live }) =>
  //     pipe([() => payload, defaultsDeep(pickId(live))])(),
  // },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#deleteDomainName-property
  destroy: {
    method: "deleteDomainName",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ config, namespace, name, userTags: Tags }),
      }),
    ])(),
});
