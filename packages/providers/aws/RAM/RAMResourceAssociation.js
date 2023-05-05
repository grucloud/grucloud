const assert = require("assert");
const { pipe, tap, get, eq, filter, not, map, switchCase } = require("rubico");
const { defaultsDeep, first, find, isEmpty, append } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const findDependencyFromEntity =
  ({ type, group, arnKey }) =>
  ({ lives, config }) =>
  (live) =>
    pipe([
      tap((params) => {
        assert(arnKey);
      }),
      lives.getByType({ type, group, providerName: config.providerName }),
      find(eq(get(`live.${arnKey}`), live.associatedEntity)),
      get("id"),
    ])();

// AuroraDB Cluster
// CodeBuildProject
// CodeBuildProjectReportGroup
// CoreNetwork
// customer ownn ipv4Pool
// Glue Catalog

// Glue Database
// Glue Table
// IPPAM resource discoveries
// Image Builder Comonent - container recipe - image recipes - images
// SSM Contact  Incidents Response Plan
// Local Gateway route tables
// Network Firewall rules group - policy
// Outpost - outpost site
// Resource Groups
// Route53 resolver firewall rule group
// Prefix List
// SageMaker pipeline - lineage group
// Private CA
// Traffic mirror target
//  transitGatewayMulticastDomain

const RamResourceDependencies = {
  appMesh: {
    type: "Mesh",
    group: "AppMesh",
    arnKey: "metadata.arn",
    dependencyId: findDependencyFromEntity({
      type: "Mesh",
      group: "AppMesh",
      arnKey: "metadata.arn",
    }),
  },
  ipamPool: {
    type: "IpamPool",
    group: "EC2",
    arnKey: "IpamPoolArn",
    dependencyId: findDependencyFromEntity({
      type: "IpamPool",
      group: "EC2",
      arnKey: "IpamPoolArn",
    }),
  },
  resolverRule: {
    type: "Rule",
    group: "Route53Resolver",
    arnKey: "Arn",
    dependencyId: findDependencyFromEntity({
      type: "Rule",
      group: "Route53Resolver",
      arnKey: "Arn",
    }),
  },
  subnet: {
    type: "Subnet",
    group: "EC2",
    arnKey: "SubnetArn",
    dependencyId: findDependencyFromEntity({
      type: "Subnet",
      group: "EC2",
      arnKey: "SubnetArn",
    }),
  },
  transitGateway: {
    type: "TransitGateway",
    group: "EC2",
    arnKey: "TransitGatewayArn",
    dependencyId: findDependencyFromEntity({
      type: "TransitGateway",
      group: "EC2",
      arnKey: "TransitGatewayArn",
    }),
  },
  verifiedAccessGroup: {
    type: "VerifiedAccessGroup",
    group: "EC2",
    arnKey: "VerifiedAccessGroupArn",
    dependencyId: findDependencyFromEntity({
      type: "Service",
      group: "VpcLattice",
      arnKey: "VerifiedAccessGroupArn",
    }),
  },
  // TODO
  vpcLatticeService: {
    type: "Service",
    group: "VpcLattice",
    arnKey: "arn",
    dependencyId: findDependencyFromEntity({
      type: "Service",
      group: "VpcLattice",
      arnKey: "arn",
    }),
  },
  vpcLatticeServiceNetwork: {
    type: "ServiceNetwork",
    group: "VpcLattice",
    arnKey: "arn",
    dependencyId: findDependencyFromEntity({
      type: "ServiceNetwork",
      group: "VpcLattice",
      arnKey: "arn",
    }),
  },
};

exports.RamResourceDependencies = RamResourceDependencies;

const findNameByDependency =
  ({ lives, config }) =>
  (live) =>
  ({ type, group, arnKey }) =>
    pipe([
      tap((params) => {
        assert(arnKey);
        assert(live);
        assert(live.associatedEntity);
      }),
      lives.getByType({ type, group, providerName: config.providerName }),
      find(eq(get(`live.${arnKey}`), live.associatedEntity)),
      tap((params) => {
        assert(true);
      }),
      get("name"),
    ])();

const findResourceName =
  ({ lives, config }) =>
  (live) =>
    pipe([
      tap((params) => {
        assert(live);
      }),
      () => RamResourceDependencies,
      map(pipe([findNameByDependency({ lives, config })(live)])),
      find(not(isEmpty)),
    ])();

const associatedEntityArn = ({ resourceDependencies }) =>
  pipe([
    () => resourceDependencies,
    Object.entries,
    first,
    ([resourceKey, resource]) =>
      getField(resource, RamResourceDependencies[resourceKey].arnKey),
  ])();

const model = ({ config }) => ({});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html
exports.RAMResourceAssociation = ({}) => ({
  type: "ResourceAssociation",
  package: "ram",
  client: "RAM",
  inferName: ({
    dependenciesSpec: {
      resourceShare,
      appMesh,
      ipamPool,
      resolverRule,
      subnet,
      transitGateway,
    },
  }) =>
    pipe([
      tap((params) => {
        assert(resourceShare);
      }),
      () => `ram-resource-assoc::${resourceShare}::`,
      switchCase([
        () => appMesh,
        append(appMesh),
        () => ipamPool,
        append(ipamPool),
        () => resolverRule,
        append(resolverRule),
        () => subnet,
        append(subnet),
        () => transitGateway,
        append(transitGateway),
        () => {
          assert(false, "missing RAMResourceAssociation dependencies");
        },
      ]),
    ]),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        findResourceName({ lives, config }),
        (resourceName) =>
          `ram-resource-assoc::${live.resourceShareName}::${resourceName}`,
      ])(),
  findId: () =>
    pipe([
      ({ resourceShareArn, associatedEntity }) =>
        `${resourceShareArn}::${associatedEntity}`,
    ]),
  ignoreErrorCodes: ["UnknownResourceException"],
  dependencies: {
    resourceShare: {
      type: "ResourceShare",
      group: "RAM",
      dependencyId: ({ lives, config }) => get("resourceShareArn"),
    },
    ...RamResourceDependencies,
  },
  omitProperties: [
    "associatedEntity",
    "creationTime",
    "lastUpdatedTime",
    "associationType",
    "resourceShareName",
    "resourceShareArn",
    "status",
  ],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#getResourceShareAssociations-property
  getById: {
    method: "getResourceShareAssociations",
    getField: "resourceShareAssociations",
    pickId: pipe([
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
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#associateResourceShare-property
  create: {
    method: "associateResourceShare",
    filterPayload: ({ associatedEntity, ...otheProps }) =>
      pipe([() => ({ resourceArns: [associatedEntity], ...otheProps })])(),
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
      ({ associatedEntity, resourceShareArn }) => ({
        resourceArns: [associatedEntity],
        resourceShareArn,
      }),
    ]),
    isInstanceDown: pipe([eq(get("status"), "DISASSOCIATED")]),
  },
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
    config,
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
