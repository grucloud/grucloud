const assert = require("assert");
const { pipe, tap, get, eq, filter, not, map, switchCase } = require("rubico");
const { defaultsDeep, first, find, isEmpty, values } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");

const RamResourceDependencies = {
  subnet: { type: "Subnet", group: "EC2", arnKey: "SubnetArn" },
  ipamPool: { type: "IpamPool", group: "EC2", arnKey: "IpamPoolArn" },
  resolverRule: { type: "Rule", group: "Route53Resolver", arnKey: "Arn" },
  transitGateway: {
    type: "TransitGateway",
    group: "EC2",
    arnKey: "TransitGatewayArn",
  },
};

exports.RamResourceDependencies = RamResourceDependencies;

const findNameByDependency =
  ({ live, lives, config }) =>
  ({ type, group, arnKey }) =>
    pipe([
      tap((params) => {
        assert(arnKey);
        assert(live.associatedEntity);
      }),
      () => lives.getByType({ type, group, providerName: config.providerName }),
      find(eq(get(`live.${arnKey}`), live.associatedEntity)),
      tap((params) => {
        assert(true);
      }),
      get("name"),
    ])();

const findResoureName = ({ live, lives, config }) =>
  pipe([
    () => RamResourceDependencies,
    map(pipe([findNameByDependency({ live, lives, config })])),
    find(not(isEmpty)),
  ])();

const findDependencyFromEntity =
  ({ live, lives, config }) =>
  ({ type, group, arnKey }) =>
    pipe([
      tap((params) => {
        assert(arnKey);
      }),
      () => lives.getByType({ type, group, providerName: config.providerName }),
      find(eq(get(`live.${arnKey}`), live.associatedEntity)),
      get("id"),
      switchCase([isEmpty, () => [], (id) => [id]]),
      (ids) => pipe([() => ({ type, group, ids })])(),
    ])();

const findDependenciesFromEntity = ({ live, lives, config }) =>
  pipe([
    () => RamResourceDependencies,
    values,
    map(pipe([findDependencyFromEntity({ live, lives, config })])),
  ])();

const associatedEntityArn = ({ resourceDependencies }) =>
  pipe([
    () => resourceDependencies,
    Object.entries,
    first,
    ([resourceKey, resource]) =>
      getField(resource, RamResourceDependencies[resourceKey].arnKey),
  ])();

const model = ({ config }) => ({
  package: "ram",
  client: "RAM",
  ignoreErrorCodes: ["UnknownResourceException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#getResourceShareAssociations-property
  getById: {
    method: "getResourceShareAssociations",
    getField: "resourceShareAssociations",
    pickId: pipe([
      tap((params) => {
        assert(true);
      }),
      tap(({ resourceShareArn, associatedEntity }) => {
        assert(resourceShareArn);
        assert(associatedEntity);
      }),
      ({ resourceShareArn, associatedEntity }) => ({
        resourceShareArns: [resourceShareArn],
        associationType: "RESOURCE",
        resourceArn: associatedEntity,
      }),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#getResourceShareAssociations-property
  getList: {
    extraParam: { associationType: "RESOURCE" },
    method: "getResourceShareAssociations",
    getParam: "resourceShareAssociations",
    transformListPre: () =>
      pipe([filter(not(eq(get("status"), "DISASSOCIATED")))]),
    decorate: ({ endpoint }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#associateResourceShare-property
  create: {
    method: "associateResourceShare",
    filterPayload: ({ associatedEntity, ...otheProps }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => ({ resourceArns: [associatedEntity], ...otheProps }),
      ])(),
    pickCreated: ({ payload }) =>
      pipe([get("resourceShareAssociations"), first]),
    isInstanceUp: pipe([eq(get("status"), "ASSOCIATED")]),
    isInstanceError: pipe([eq(get("status"), "FAILED")]),
    getErrorMessage: get("statusMessage", "error"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#updateResourceShare-property
  // update: {
  //   method: "updateResourceShare",
  //   //TODO
  // },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#disassociateResourceShare-property
  destroy: {
    method: "disassociateResourceShare",
    pickId: pipe([
      tap((params) => {
        assert(true);
      }),
      ({ associatedEntity, resourceShareArn }) => ({
        resourceArns: [associatedEntity],
        resourceShareArn,
      }),
    ]),
    isInstanceDown: pipe([eq(get("status"), "DISASSOCIATED")]),
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html
exports.RAMResourceAssociation = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: ({ live, lives }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => ({ live, lives, config }),
        findResoureName,
        (resourceName) =>
          `ram-resource-assoc::${live.resourceShareName}::${resourceName}`,
      ])(),
    findId: pipe([
      get("live"),
      ({ resourceShareArn, associatedEntity }) =>
        `${resourceShareArn}::${associatedEntity}`,
    ]),
    findDependencies: ({ live, lives }) => [
      {
        type: "ResourceShare",
        group: "RAM",
        ids: [live.resourceShareArn],
      },
      ...findDependenciesFromEntity({ live, lives, config }),
    ],
    getByName: ({ getList, endpoint }) =>
      pipe([
        ({ name }) => ({ name, resourceShareStatus: "ACTIVE" }),
        getList,
        first,
      ]),
    configDefault: ({
      name,
      namespace,
      properties: { ...otheProps },
      dependencies: { resourceShare, ...resourceDependencies },
    }) =>
      pipe([
        tap((params) => {
          assert(resourceShare);
          assert(resourceDependencies);
        }),
        () => otheProps,
        defaultsDeep({
          resourceShareArn: getField(resourceShare, "resourceShareArn"),
          associatedEntity: associatedEntityArn({ resourceDependencies }),
        }),
      ])(),
  });
