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
} = require("rubico");
const { isEmpty, defaultsDeep, identity, size } = require("rubico/x");
const logger = require("@grucloud/core/logger")({ prefix: "AwsVpc" });
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");
const { getByNameCore } = require("@grucloud/core/Common");
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
  const managedByOther = isDefault;

  const findName = switchCase([
    get("live.IsDefault"),
    () => "vpc-default",
    findNameInTags,
  ]);

  const findId = get("live.VpcId");

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
        identity,
      ]),
      tap((items) => {
        logger.debug(`getList vpc result: ${tos(items)}`);
      }),
      (items) => ({
        total: size(items),
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList #vpc ${total}`);
      }),
    ])();

  const getByName = getByNameCore({ getList, findName });

  const getById = getByIdCore({ fieldIds: "VpcIds", getList });

  const isInstanceUp = eq(get("State"), "available");

  const isUpById = pipe([getById, isInstanceUp]);
  const isDownById = pipe([getById, isEmpty]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createVpc-property

  const create = ({
    payload: { DnsHostnames, DnsSupport, ...vpcPayload },
    name,
  }) =>
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
        () => DnsSupport,
        pipe([
          tap(() => {
            logger.info(`create vpc modifyVpcAttribute DnsSupport`);
          }),
          (VpcId) =>
            ec2().modifyVpcAttribute({
              EnableDnsSupport: {
                Value: true,
              },
              VpcId,
            }),
        ])
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

  const destroy = ({ name, live }) =>
    pipe([
      tap(() => {
        logger.info(`destroy vpc ${JSON.stringify({ name })}`);
      }),
      () => live,
      pick(["VpcId"]),
      tap(destroySubnets),
      tap(destroySecurityGroup),
      tap(destroyRouteTables),
      tap(ec2().deleteVpc),
      tap(({ VpcId }) =>
        retryCall({
          name: `destroy vpc isDownById: ${name} id: ${VpcId}`,
          fn: () => isDownById({ id: VpcId }),
          config,
        })
      ),
      tap(() => {
        logger.info(`destroyed vpc ${JSON.stringify({ name })}`);
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
    shouldRetryOnException,
  };
};
