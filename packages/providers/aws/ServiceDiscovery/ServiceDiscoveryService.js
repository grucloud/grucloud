const assert = require("assert");
const { pipe, tap, get, pick, switchCase } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./ServiceDiscoveryCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ Id }) => {
    assert(Id);
  }),
  pick(["Id"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceDiscovery.html
exports.ServiceDiscoveryService = () => ({
  type: "Service",
  package: "servicediscovery",
  client: "ServiceDiscovery",
  propertiesDefault: {},
  omitProperties: [
    "CreateDate",
    "Id",
    "Arn",
    "Type",
    "CreatorRequestId",
    "NamespaceId",
    "DnsConfig.NamespaceId",
  ],
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("Arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ServiceNotFound"],
  dependencies: {
    namespaceHttp: {
      type: "HttpNamespace",
      group: "ServiceDiscovery",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("NamespaceId")]),
    },
    namespacePrivateDns: {
      type: "PrivateDnsNamespace",
      group: "ServiceDiscovery",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("NamespaceId")]),
    },
    namespacePublicDns: {
      type: "PublicDnsNamespace",
      group: "ServiceDiscovery",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("NamespaceId")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceDiscovery.html#getService-property
  getById: {
    method: "getService",
    getField: "Service",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceDiscovery.html#listServices-property
  getList: {
    method: "listServices",
    getParam: "Services",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceDiscovery.html#createService-property
  create: {
    method: "createService",
    pickCreated: ({ payload }) => pipe([get("Service")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceDiscovery.html#updateService-property
  update: {
    method: "updateService",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceDiscovery.html#deleteService-property
  destroy: {
    method: "deleteService",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    Service,
    properties: { Tags, ...otherProps },
    dependencies: { namespaceHttp, namespacePrivateDns, namespacePublicDns },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, Service, UserTags: Tags }),
      }),
      switchCase([
        () => namespaceHttp,
        defaultsDeep({ NamespaceId: getField(namespaceHttp, "Id") }),
        () => namespacePrivateDns,
        defaultsDeep({ NamespaceId: getField(namespacePrivateDns, "Id") }),
        () => namespacePublicDns,
        defaultsDeep({ NamespaceId: getField(namespacePublicDns, "Id") }),
        () => {
          assert(false);
        },
      ]),
    ])(),
});
