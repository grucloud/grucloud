const assert = require("assert");
const {
  get,
  map,
  tap,
  pipe,
  filter,
  switchCase,
  eq,
  not,
  tryCatch,
  assign,
  pick,
  omit,
  and,
} = require("rubico");
const {
  isEmpty,
  defaultsDeep,
  size,
  when,
  prepend,
  callProp,
  first,
  find,
} = require("rubico/x");
const logger = require("@grucloud/core/logger")({ prefix: "Vpc" });
const { tos } = require("@grucloud/core/tos");
const { getField } = require("@grucloud/core/ProviderCommon");
const {
  getByNameCore,
  cidrToSubnetMaskLength,
} = require("@grucloud/core/Common");
const { buildTags, findNameInTagsOrId, arnFromId } = require("../AwsCommon");

const { tagResource, untagResource } = require("./EC2Common");

const isDefault = () => get("IsDefault");
const cannotBeDeleted = isDefault;
const managedByOther = isDefault;

const findId = () => get("VpcId");
const findName = ({ lives, config }) =>
  switchCase([
    get("IsDefault"),
    () => "vpc-default",
    findNameInTagsOrId({ findId })({ lives, config }),
  ]);

const pickId = pick(["VpcId"]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(config);
    }),
    assign({
      DnsSupport: pipe([
        ({ VpcId }) => ({
          VpcId,
          Attribute: "enableDnsSupport",
        }),
        endpoint().describeVpcAttribute,
        get("EnableDnsSupport.Value"),
      ]),
      DnsHostnames: pipe([
        ({ VpcId }) => ({
          VpcId,
          Attribute: "enableDnsHostnames",
        }),
        endpoint().describeVpcAttribute,
        get("EnableDnsHostnames.Value"),
      ]),
      VpcArn: pipe([
        get("VpcId"),
        prepend("vpc/"),
        arnFromId({ service: "ec2", config }),
      ]),
    }),
  ]);

const destroySubnets =
  ({ endpoint }) =>
  ({ VpcId }) =>
    pipe([
      // Get the subnets belonging to this Vpc
      () => ({
        Filters: [
          {
            Name: "vpc-id",
            Values: [VpcId],
          },
        ],
      }),
      endpoint().describeSubnets,
      get("Subnets"),
      // Loop through the subnets
      filter(not(get("DefaultForAz"))),
      map(
        tryCatch(
          pipe([
            tap(({ SubnetId }) => {
              logger.debug(`destroy vpc, deleteSubnet SubnetId: ${SubnetId}`);
            }),
            pick(["SubnetId"]),
            endpoint().deleteSubnet,
          ]),
          (error, subnet) =>
            pipe([
              tap(() => {
                logger.error(
                  `deleteSubnet: ${tos(subnet)}, error ${tos(error)}`
                );
              }),
              () => ({ error, subnet }),
            ])()
        )
      ),
    ])();

const destroySecurityGroup =
  ({ endpoint }) =>
  ({ VpcId }) =>
    pipe([
      tap(() => {
        logger.debug(`vpc destroySecurityGroup: VpcId: ${VpcId}`);
      }),
      // Get the security groups belonging to this Vpc
      () => ({
        Filters: [
          {
            Name: "vpc-id",
            Values: [VpcId],
          },
        ],
      }),
      endpoint().describeSecurityGroups,
      get("SecurityGroups"),
      // remove the default security groups
      filter(not(eq(get("GroupName"), "default"))),
      tap((securityGroups) => {
        logger.info(
          `vpc destroySecurityGroup: VpcId: ${VpcId} #securityGroups ${size(
            securityGroups
          )}`
        );
      }),
      map(
        tryCatch(
          pipe([
            tap(({ GroupId }) => {
              logger.debug(`destroySecurityGroup: GroupId: ${GroupId}`);
            }),
            pick(["GroupId"]),
            endpoint().deleteSecurityGroup,
          ]),
          (error, securityGroup) =>
            pipe([
              tap(() => {
                logger.error(
                  `deleteSecurityGroup: ${tos(securityGroup)}, error ${tos(
                    error
                  )}`
                );
              }),
              () => ({ error, securityGroup }),
            ])()
        )
      ),
    ])();

const destroyRouteTables =
  ({ endpoint }) =>
  ({ VpcId }) =>
    pipe([
      // Get the route tables belonging to this Vpc
      () => ({
        Filters: [
          {
            Name: "vpc-id",
            Values: [VpcId],
          },
        ],
      }),
      endpoint().describeRouteTables,
      get("RouteTables"),
      // Loop through the route tables
      tap((RouteTables) => {
        logger.debug(`destroy vpc, RouteTables: ${tos(RouteTables)}`);
      }),
      filter(pipe([get("Associations"), isEmpty])),
      map(
        tryCatch(
          pipe([
            tap(({ RouteTableId }) => {
              logger.debug(
                `destroy vpc, deleteRouteTable RouteTableId: ${tos(
                  RouteTableId
                )})}`
              );
            }),
            pick(["RouteTableId"]),
            endpoint().deleteRouteTable,
          ]),
          (error, routeTable) =>
            pipe([
              tap(() => {
                logger.error(
                  `deleteRouteTable: ${tos(routeTable)}, error ${tos(error)}`
                );
              }),
              () => ({ error, routeTable }),
            ])()
        )
      ),
    ])();

exports.EC2Vpc = ({ compare }) => ({
  type: "Vpc",
  package: "ec2",
  client: "EC2",
  findName,
  findId,
  cannotBeDeleted,
  managedByOther,
  isDefault,
  omitProperties: [
    "DhcpOptionsId",
    "State",
    "OwnerId",
    "InstanceTenancy",
    "Ipv6CidrBlockAssociationSet",
    "CidrBlockAssociationSet",
    "IsDefault",
    "VpcId",
    "VpcArn",
    "Ipv4IpamPoolId",
  ],
  dependencies: {
    ipamPoolIpv4: {
      type: "IpamPool",
      group: "EC2",
      dependencyId:
        ({ lives, config }) =>
        (live) =>
          pipe([
            lives.getByType({
              type: "IpamPool",
              group: "EC2",
              providerName: config.providerName,
            }),
            find(
              and([
                eq(get("live.AddressFamily"), "ipv4"),
                pipe([
                  get("live.Allocations"),
                  find(eq(get("ResourceId"), live.VpcId)),
                ]),
              ])
            ),
            get("live.IpamPoolId"),
          ])(),
    },
    // TODO ipamPoolIpv6
    // ipamPoolIpv6: {
    //   type: "IpamPool",
    //   group: "EC2",
    //   filterDependency:
    //     ({ resource }) =>
    //     (dependency) =>
    //       pipe([
    //         () => resource,
    //         get("live.Ipv6CidrBlockAssociationSet[0].Ipv6CidrBlock"),
    //       ])(),
    //},
  },
  propertiesDefault: { DnsSupport: true, DnsHostnames: false },

  compare: compare({
    filterAll: () =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        omit(["CidrBlock"]),
      ]),
    filterTarget: () =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        omit([
          "AmazonProvidedIpv6CidrBlock",
          "Ipv4NetmaskLength",
          // TODO
          "Ipv6NetmaskLength",
        ]),
      ]),
  }),
  filterLive: ({ resource }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      when(
        pipe([
          () => resource.dependencies,
          find(eq(get("groupType"), "EC2::IpamPool")),
          get("ids"),
          not(isEmpty),
        ]),
        pipe([
          when(
            get("CidrBlock"),
            assign({
              Ipv4NetmaskLength: pipe([
                get("CidrBlock"),
                cidrToSubnetMaskLength,
              ]),
            })
          ),
          omit(["CidrBlock"]),
        ])
      ),
      // TODO ipv6
      when(
        pipe([
          get("Ipv6CidrBlockAssociationSet"),
          first,
          eq(get("Ipv6Pool"), "Amazon"),
        ]),
        assign({ AmazonProvidedIpv6CidrBlock: () => true })
      ),
    ]),
  getById: {
    method: "describeVpcs",
    getField: "Vpcs",
    pickId: pipe([
      tap(({ VpcId }) => {
        assert(VpcId);
      }),
      ({ VpcId }) => ({ VpcIds: [VpcId] }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVpcs-property
  getList: {
    method: "describeVpcs",
    getParam: "Vpcs",
    decorate,
  },
  create: {
    method: "createVpc",
    isInstanceUp: eq(get("State"), "available"),
    filterPayload: omit(["DnsHostnames", "DnsSupport"]),
    pickCreated: () => get("Vpc"),
    // IPAM error
    shouldRetryOnExceptionMessages: [
      "The allocation size is too big for the pool",
    ],
    postCreate:
      ({ endpoint, payload }) =>
      ({ VpcId }) =>
        pipe([
          tap(() => {
            assert(payload);
            assert(VpcId);
          }),
          () => payload,
          tap.if(
            get("DnsSupport"),
            pipe([
              tap(() => {
                logger.info(`create vpc modifyVpcAttribute DnsSupport`);
              }),
              () => ({
                EnableDnsSupport: {
                  Value: true,
                },
                VpcId,
              }),
              endpoint().modifyVpcAttribute,
            ])
          ),
          tap.if(
            get("DnsHostnames"),
            pipe([
              tap(() => {
                logger.info(`create vpc modifyVpcAttribute EnableDnsHostnames`);
              }),
              () => ({
                EnableDnsHostnames: {
                  Value: true,
                },
                VpcId,
              }),
              endpoint().modifyVpcAttribute,
            ])
          ),
        ])(),
  },
  update:
    ({ endpoint }) =>
    async ({ diff, payload, live }) =>
      pipe([
        tap((params) => {
          assert(live.VpcId);
        }),
        () => diff,
        tap.if(
          pipe([
            get("liveDiff.updated"),
            callProp("hasOwnProperty", "DnsSupport"),
          ]),
          pipe([
            () => ({
              EnableDnsSupport: {
                Value: payload.DnsSupport,
              },
              VpcId: live.VpcId,
            }),
            endpoint().modifyVpcAttribute,
          ])
        ),
        tap.if(
          pipe([
            get("liveDiff.updated"),
            callProp("hasOwnProperty", "DnsHostnames"),
          ]),
          pipe([
            () => ({
              EnableDnsHostnames: {
                Value: payload.DnsHostnames,
              },
              VpcId: live.VpcId,
            }),
            endpoint().modifyVpcAttribute,
          ])
        ),
      ])(),
  destroy: {
    pickId,
    preDestroy: ({ endpoint }) =>
      pipe([
        tap(destroySubnets({ endpoint })),
        tap(destroySecurityGroup({ endpoint })),
        tap(destroyRouteTables({ endpoint })),
      ]),
    method: "deleteVpc",
    ignoreErrorCodes: ["InvalidVpcID.NotFound"],
  },
  getByName: getByNameCore,
  tagger: ({ config }) => ({
    tagResource,
    untagResource,
  }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { ipamPoolIpv4, ipamPoolIpv6 },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        TagSpecifications: [
          {
            ResourceType: "vpc",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
      when(
        () => ipamPoolIpv4,
        pipe([
          tap((params) => {
            assert(otherProps.Ipv4NetmaskLength, "missing Ipv4NetmaskLength");
            assert(
              !otherProps.CidrBlock,
              "The parameter 'ipv4NetmaskLength' may not be used in combination with 'cidrBlock'"
            );
          }),
          defaultsDeep({
            Ipv4IpamPoolId: getField(ipamPoolIpv4, "IpamPoolId"),
          }),
        ])
      ),
      when(
        () => ipamPoolIpv6,
        pipe([
          tap((params) => {
            assert(otherProps.Ipv6NetmaskLength, "missing Ipv6NetmaskLength");
          }),
          defaultsDeep({
            Ipv6IpamPoolId: getField(ipamPoolIpv6, "IpamPoolId"),
          }),
        ])
      ),
    ])(),
});
