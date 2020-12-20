const AWS = require("aws-sdk");
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

  const getList = async ({ params } = {}) => {
    logger.debug(`getList vpc ${tos(params)}`);
    const { Vpcs } = await ec2().describeVpcs(params);
    logger.debug(`getList ${tos(Vpcs)}`);

    return {
      total: Vpcs.length,
      items: Vpcs,
    };
  };

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
  const create = async ({ name, payload }) => {
    assert(name);
    assert(payload);
    logger.debug(`create vpc ${tos({ name, payload })}`);
    const {
      Vpc: { VpcId },
    } = await ec2().createVpc(payload);
    logger.info(`create vpc ${VpcId}`);

    await retryCall({
      name: `isUpById: ${name} id: ${VpcId}`,
      fn: () => isUpById({ id: VpcId }),
      config,
    });

    await tagResource({
      config,
      name,
      resourceType: "vpc",
      resourceId: VpcId,
    });

    const vpc = await getById({ id: VpcId });

    assert(
      CheckAwsTags({
        config,
        tags: vpc.Tags,
        name: name,
      }),
      `missing tag for ${name}`
    );

    return { VpcId };
  };

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
      async ({ Subnets }) =>
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

  const destroy = async ({ id, name }) => {
    logger.debug(`destroy vpc ${tos({ name, id })}`);
    assert(id, "destroy vpc invalid id");

    await destroySubnets({ VpcId: id });
    await destroySecurityGroup({ VpcId: id });
    await destroyRouteTables({ VpcId: id });

    logger.debug(`destroy vpc , deleting VpcId: ${id}`);
    const result = await ec2().deleteVpc({ VpcId: id });
    return result;
  };

  const configDefault = async ({ properties }) => properties;

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
