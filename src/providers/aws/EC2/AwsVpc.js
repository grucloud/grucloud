const { isEmpty } = require("rubico/x");
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
} = require("rubico");
const logger = require("../../../logger")({ prefix: "AwsVpc" });
const { tos } = require("../../../tos");
const { retryCall } = require("../../Retry");
const { getByIdCore } = require("../AwsCommon");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");
const {
  Ec2New,
  findNameInTags,
  shouldRetryOnException,
} = require("../AwsCommon");
const { tagResource } = require("../AwsTagResource");
const { CheckAwsTags } = require("../AwsTagCheck");

module.exports = AwsVpc = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const ec2 = Ec2New(config);

  const findName = switchCase([
    get("IsDefault"),
    () => "default",
    findNameInTags,
  ]);

  const findId = get("VpcId");

  const getList = ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList vpc ${JSON.stringify(params)}`);
      }),
      () => ec2().describeVpcs(params),
      get("Vpcs"),
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

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });

  const getById = getByIdCore({ fieldIds: "VpcIds", getList });

  const getStateName = (instance) => instance.State;
  const isInstanceUp = (instance) => {
    return ["available"].includes(getStateName(instance));
  };

  const isUpById = isUpByIdCore({
    isInstanceUp,
    getById,
  });

  const isDownById = isDownByIdCore({ getById });

  const cannotBeDeleted = ({ resource }) => {
    assert(resource.hasOwnProperty("IsDefault"));
    return resource.IsDefault;
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createVpc-property

  const create = async ({ payload, name }) =>
    pipe([
      tap(() => {
        logger.info(`create vpc ${tos({ name })}`);
      }),
      () => ec2().createVpc(payload),
      get("Vpc.VpcId"),
      tap((VpcId) =>
        pipe([
          () =>
            retryCall({
              name: `subnet isUpById: ${name} id: ${VpcId}`,
              fn: () => isUpById({ id: VpcId, name }),
              config,
            }),
          () =>
            tagResource({
              config,
              name,
              resourceType: "vpc",
              resourceId: VpcId,
            }),
        ])()
      ),
      tap((SubnetId) => {
        logger.info(`created subnet ${tos({ name, SubnetId })}`);
      }),
      (id) => ({ id }),
    ])();

  const destroySubnets = async ({ VpcId }) =>
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
      // Loop through the subnets
      ({ Subnets }) =>
        pipe([
          filter((subnet) => !subnet.DefaultForAz),
          (Subnets) =>
            map(
              async (subnet) => {
                logger.debug(
                  `destroy vpc, deleteSubnet SubnetId: ${subnet.SubnetId}`
                );
                await ec2().deleteSubnet({ SubnetId: subnet.SubnetId });
              }
              // remove the default subnet
              // deleteSubnet
            )(Subnets),
        ])(Subnets),
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
      pipe([
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
      ]),
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
      // Loop through the route tables
      tap(({ RouteTables }) => {
        logger.debug(`destroy vpc, RouteTables: ${tos(RouteTables)}`);
      }),
      ({ RouteTables }) => {
        pipe([
          filter((routeTable) => isEmpty(routeTable.Associations)),
          (RouteTables) =>
            map(async (routeTable) => {
              logger.debug(
                `destroy vpc, deleteRouteTable routeTable: ${tos(routeTable)})}`
              );
              await ec2().deleteRouteTable({
                RouteTableId: routeTable.RouteTableId,
              });
            })(RouteTables),
        ])(RouteTables);
      },
    ])();

  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.debug(`destroy vpc ${tos({ name, id })}`);
      }),
      () => destroySubnets({ VpcId: id }),
      () => destroySecurityGroup({ VpcId: id }),
      () => destroyRouteTables({ VpcId: id }),
      () => ec2().deleteVpc({ VpcId: id }),
      tap(() => {
        logger.debug(`destroyed vpc ${tos({ name, id })}`);
      }),
    ])();

  const configDefault = ({ properties }) => properties;

  return {
    type: "Vpc",
    spec,
    findId,
    isUpById,
    isDownById,
    getByName,
    getById,
    findName,
    cannotBeDeleted,
    getList,
    create,
    destroy,
    configDefault,
    shouldRetryOnException,
  };
};
