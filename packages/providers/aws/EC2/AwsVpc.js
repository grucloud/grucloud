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
} = require("rubico");
const { isEmpty, defaultsDeep, when, size } = require("rubico/x");
const logger = require("@grucloud/core/logger")({ prefix: "AwsVpc" });
const { tos } = require("@grucloud/core/tos");
const { getByNameCore } = require("@grucloud/core/Common");
const {
  Ec2New,
  getByIdCore,
  buildTags,
  findNamespaceInTags,
  findNameInTagsOrId,
} = require("../AwsCommon");

const { AwsClient } = require("../AwsClient");

exports.AwsVpc = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const ec2 = Ec2New(config);

  const isDefault = get("live.IsDefault");
  const cannotBeDeleted = isDefault;
  const managedByOther = isDefault;

  const findId = get("live.VpcId");
  const findName = switchCase([
    get("live.IsDefault"),
    () => "vpc-default",
    findNameInTagsOrId({ findId }),
  ]);

  const pickId = pick(["VpcId"]);

  const decorate = () =>
    pipe([
      assign({
        DnsSupport: pipe([
          ({ VpcId }) =>
            ec2().describeVpcAttribute({
              VpcId,
              Attribute: "enableDnsSupport",
            }),
          get("EnableDnsSupport.Value"),
        ]),
        DnsHostnames: pipe([
          ({ VpcId }) =>
            ec2().describeVpcAttribute({
              VpcId,
              Attribute: "enableDnsHostnames",
            }),
          get("EnableDnsHostnames.Value"),
        ]),
      }),
    ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVpcs-property
  const getList = client.getList({
    method: "describeVpcs",
    getParam: "Vpcs",
    decorate,
  });

  const getByName = getByNameCore({ getList, findName });

  const getById = pipe([
    tap(({ VpcId }) => {
      assert(VpcId);
    }),
    ({ VpcId }) => ({ id: VpcId }),
    getByIdCore({ fieldIds: "VpcIds", getList }),
  ]);

  const isInstanceUp = eq(get("State"), "available");

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createVpc-property
  const create = client.create({
    method: "createVpc",
    isInstanceUp,
    filterPayload: omit(["DnsHostnames", "DnsSupport"]),
    pickCreated: (payload) => (result) =>
      pipe([
        tap((params) => {
          assert(payload);
        }),
        () => result,
        get("Vpc"),
        pickId,
      ])(),
    pickId,
    getById,
    postCreate:
      ({ payload }) =>
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
              ec2().modifyVpcAttribute,
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
              ec2().modifyVpcAttribute,
            ])
          ),
        ])(),
    config,
  });

  const destroySubnets = ({ VpcId }) =>
    pipe([
      // Get the subnets belonging to this Vpc
      () =>
        ec2().describeSubnets({
          Filters: [
            {
              Name: "vpc-id",
              Values: [VpcId],
            },
          ],
        }),
      get("Subnets"),
      // Loop through the subnets
      filter(not(get("DefaultForAz"))),
      map(
        tryCatch(
          pipe([
            tap(({ SubnetId }) => {
              logger.debug(`destroy vpc, deleteSubnet SubnetId: ${SubnetId}`);
            }),
            ({ SubnetId }) => ec2().deleteSubnet({ SubnetId }),
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

  const destroySecurityGroup = ({ VpcId }) =>
    pipe([
      tap(() => {
        logger.debug(`vpc destroySecurityGroup: VpcId: ${VpcId}`);
      }),
      // Get the security groups belonging to this Vpc
      () =>
        ec2().describeSecurityGroups({
          Filters: [
            {
              Name: "vpc-id",
              Values: [VpcId],
            },
          ],
        }),
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
            ({ GroupId }) =>
              ec2().deleteSecurityGroup({
                GroupId,
              }),
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

  const destroyRouteTables = ({ VpcId }) =>
    pipe([
      // Get the route tables belonging to this Vpc
      () =>
        ec2().describeRouteTables({
          Filters: [
            {
              Name: "vpc-id",
              Values: [VpcId],
            },
          ],
        }),
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
            ({ RouteTableId }) =>
              ec2().deleteRouteTable({
                RouteTableId,
              }),
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

  const destroy = client.destroy({
    pickId,
    preDestroy: pipe([
      get("live"),
      tap(destroySubnets),
      tap(destroySecurityGroup),
      tap(destroyRouteTables),
    ]),
    method: "deleteVpc",
    getById,
    ignoreErrorCodes: ["InvalidVpcID.NotFound"],
    config,
  });

  const configDefault = async ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
  }) =>
    defaultsDeep({
      TagSpecifications: [
        {
          ResourceType: "vpc",
          Tags: buildTags({ config, namespace, name, UserTags: Tags }),
        },
      ],
    })(otherProps);

  return {
    spec,
    isDefault,
    managedByOther,
    cannotBeDeleted,
    findId,
    findNamespace: findNamespaceInTags(config),
    getByName,
    findName,
    getList,
    create,
    destroy,
    configDefault,
  };
};
