const assert = require("assert");
const { pipe, tap, get, pick, eq, omit } = require("rubico");
const { defaultsDeep, pluck, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, ignoreErrorCodes } = require("./ApiGatewayV2Common");

const buildArn =
  ({ config }) =>
  ({ DomainName }) =>
    `arn:aws:apigateway:${config.region}::/domainnames/${DomainName}`;

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
  omitProperties: ["DomainNameConfigurations"],
  filterLive: () =>
    pipe([
      when(
        eq(get("ApiMappingSelectionExpression"), "$request.basepath"),
        omit(["ApiMappingSelectionExpression"])
      ),
    ]),
  dependencies: {
    certificate: {
      type: "Certificate",
      group: "ACM",
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
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createDomainName-property
  create: {
    method: "createDomainName",
    shouldRetryOnExceptionCodes: [
      "UnsupportedCertificate",
      "BadRequestException",
    ],
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
    dependencies: { certificate },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(certificate, "missing 'certificate' dependency");
      }),
      () => otherProps,
      defaultsDeep({
        DomainName: name,
        DomainNameConfigurations: [
          {
            CertificateArn: getField(certificate, "CertificateArn"),
          },
        ],
        Tags: buildTagsObject({ config, namespace, name, userTags: Tags }),
      }),
    ])(),
});
