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
} = require("rubico");
const { isEmpty, defaultsDeep } = require("rubico/x");
const logger = require("@grucloud/core/logger")({ prefix: "AwsVpc" });
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");
const {
  getByNameCore,
  isUpByIdCore,
  isDownByIdCore,
} = require("@grucloud/core/Common");
const {
  Ec2New,
  getByIdCore,
  buildTags,
  findNameInTags,
  findNamespaceInTags,
  shouldRetryOnException,
} = require("../AwsCommon");

exports.AwsVpc = ({ spec, config }) => {
  const ec2 = Ec2New(config);

  const isDefault = get("live.IsDefault");
  const cannotBeDeleted = isDefault;

  const findName = switchCase([
    get("IsDefault"),
    () => "default",
    findNameInTags,
  ]);

  const findId = get("VpcId");

  const getList = ({ params, deep } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList vpc ${JSON.stringify({ params, deep })}`);
      }),
      () => ec2().describeVpcs(params),
      get("Vpcs"),
      switchCase([
        () => deep,
        map(
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
          })
        ),
        (items) => items,
      ]),
      tap((items) => {
        logger.debug(`getList vpc result: ${tos(items)}`);
      }),
      (items) => ({
        total: items.length,
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList #vpc ${total}`);
      }),
    ])();

  const getByName = ({ name, lives }) =>
    getByNameCore({ name, getList, findName, deep: false, lives });

  const getById = getByIdCore({ fieldIds: "VpcIds", getList });

  const isInstanceUp = eq(get("State"), "available");

  const isUpById = isUpByIdCore({
    isInstanceUp,
    getById,
  });

  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createVpc-property

  const create = async ({ payload: { DnsHostnames, ...vpcPayload }, name }) =>
    pipe([
      tap(() => {
        logger.info(`create vpc ${JSON.stringify({ name })}`);
      }),
      () => ec2().createVpc(vpcPayload),
      get("Vpc.VpcId"),
      tap((VpcId) =>
        retryCall({
          name: `vpc isUpById: ${name} id: ${VpcId}`,
          fn: () => isUpById({ id: VpcId, name }),
          config,
        })
      ),
      tap.if(
        () => DnsHostnames,
        pipe([
          tap(() => {
            logger.info(`create vpc modifyVpcAttribute EnableDnsHostnames`);
          }),
          (VpcId) =>
            ec2().modifyVpcAttribute({
              EnableDnsHostnames: {
                Value: true,
              },
              VpcId,
            }),
        ])
      ),
      tap((VpcId) => {
        logger.info(`created vpc ${JSON.stringify({ name, VpcId })}`);
      }),
      (id) => ({ id }),
    ])();

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

  const destroySecurityGroup = async ({ VpcId }) =>
    pipe([
      tap(() => {
        logger.debug(`destroySecurityGroup: VpcId: ${VpcId}`);
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

  const destroyRouteTables = async ({ VpcId }) =>
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

  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.info(`destroy vpc ${JSON.stringify({ name, id })}`);
      }),
      () => destroySubnets({ VpcId: id }),
      () => destroySecurityGroup({ VpcId: id }),
      () => destroyRouteTables({ VpcId: id }),
      () => ec2().deleteVpc({ VpcId: id }),
      tap(() =>
        retryCall({
          name: `destroy vpc isDownById: ${name} id: ${id}`,
          fn: () => isDownById({ id }),
          config,
        })
      ),
      tap(() => {
        logger.info(`destroyed vpc ${JSON.stringify({ name, id })}`);
      }),
    ])();

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
    type: "Vpc",
    spec,
    isDefault,
    findId,
    findNamespace: findNamespaceInTags(config),
    getByName,
    findName,
    cannotBeDeleted,
    getList,
    create,
    destroy,
    configDefault,
    shouldRetryOnException,
  };
};
