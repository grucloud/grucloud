const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");
const { ignoreErrorCodes, Tagger } = require("./APIGatewayCommon");

const findName = () =>
  pipe([
    get("description"),
    tap((description) => {
      assert(description);
    }),
  ]);

const findId = () =>
  pipe([
    get("clientCertificateId"),
    tap((clientCertificateId) => {
      assert(clientCertificateId);
    }),
  ]);

const pickId = pipe([
  tap(({ clientCertificateId }) => {
    assert(clientCertificateId);
  }),
  pick(["clientCertificateId"]),
]);

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const assignArn = ({ config }) =>
  pipe([
    assign({
      arn: pipe([
        tap(({ clientCertificateId }) => {
          assert({ clientCertificateId });
        }),
        ({ clientCertificateId }) =>
          `arn:aws:apigateway:${config.region}::/clientcertificates/${clientCertificateId}`,
      ]),
    }),
  ]);

const decorate = ({ config }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    assignArn({ config }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html
exports.APIGatewayClientCertificate = ({}) => ({
  type: "ClientCertificate",
  package: "api-gateway",
  client: "APIGateway",
  inferName: findName,
  findName,
  findId,
  ignoreErrorCodes,
  omitProperties: [
    "clientCertificateId",
    "arn",
    "createdDate",
    "expirationDate",
    "pemEncodedCertificate",
  ],
  propertiesDefault: {},
  getById: {
    method: "getClientCertificate",
    pickId,
    decorate,
  },
  getList: {
    method: "getClientCertificates",
    getParam: "items",
    decorate,
  },
  create: {
    method: "generateClientCertificate",
    pickCreated: ({ payload }) => identity,
  },
  update: {
    pickId,
    method: "updateClientCertificate",
    filterParams: ({ payload, live, diff }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  destroy: {
    pickId,
    method: "deleteClientCertificate",
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
    ])(),
});
