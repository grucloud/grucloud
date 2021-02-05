const assert = require("assert");
const {
  tap,
  get,
  pipe,
  filter,
  map,
  not,
  eq,
  fork,
  switchCase,
} = require("rubico");
const { isEmpty, defaultsDeep } = require("rubico/x");

const logger = require("../../../logger")({ prefix: "AwsRtb" });
const { tos } = require("../../../tos");
const { retryCall } = require("../../Retry");
const { getByIdCore, buildTags } = require("../AwsCommon");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");
const {
  Ec2New,
  findNameInTagsOrId,
  shouldRetryOnException,
} = require("../AwsCommon");
const { tagResource } = require("../AwsTagResource");
const { CheckAwsTags } = require("../AwsTagCheck");

module.exports = AwsRouteTables = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const ec2 = Ec2New(config);

  const findId = get("RouteTableId");
  const findName = (item) => findNameInTagsOrId({ item, findId });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeRouteTables-property
  const getList = ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList rt ${JSON.stringify(params)}`);
      }),
      () => ec2().describeRouteTables(params),
      get("RouteTables"),
      tap((items) => {
        logger.debug(`getList rt result: ${tos(items)}`);
      }),
      (items) => ({
        total: items.length,
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList #rt ${total}`);
      }),
    ])();

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });
  const getById = getByIdCore({ fieldIds: "RouteTableIds", getList });

  const isUpById = isUpByIdCore({
    getById,
  });
  const isDownById = isDownByIdCore({ getById });

  const associateRouteTableToSubnet = ({ subnet, RouteTableId }) =>
    switchCase([
      () => subnet,
      pipe([
        tap(() => {
          assert(subnet.live.SubnetId, "subnet.live.SubnetId");
        }),
        () =>
          ec2().associateRouteTable({
            RouteTableId,
            SubnetId: subnet.live.SubnetId,
          }),
      ]),
      () => undefined,
    ]);

  const createRouteInternetGateway = ({ ig, RouteTableId }) =>
    switchCase([
      () => ig,
      pipe([
        tap(() => {
          assert(ig.live.InternetGatewayId, "ig.live.InternetGatewayId");
        }),
        () =>
          ec2().createRoute({
            DestinationCidrBlock: "0.0.0.0/0",
            RouteTableId,
            GatewayId: ig.live.InternetGatewayId,
          }),
      ]),
      () => undefined,
    ]);

  const createRouteNatGateway = ({ natGateway, RouteTableId }) =>
    switchCase([
      () => natGateway,
      pipe([
        tap(() => {
          assert(natGateway.live.NatGatewayId, "natGateway.live.NatGatewayId");
        }),
        () =>
          ec2().createRoute({
            DestinationCidrBlock: "0.0.0.0/0",
            RouteTableId,
            NatGatewayId: natGateway.live.NatGatewayId,
          }),
      ]),
      () => undefined,
    ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createRouteTable-property
  const create = async ({
    payload,
    name,
    resolvedDependencies: { vpc, subnet, ig, natGateway },
  }) =>
    pipe([
      tap(() => {
        logger.info(`create rt ${tos({ name })}`);
        assert(vpc, "RouteTables is missing the dependency 'vpc'");
        assert(
          subnet || ig || natGateway,
          "RouteTables needs the dependency 'subnet', 'ig', or 'natGateway'"
        );
      }),
      () =>
        defaultsDeep({
          VpcId: vpc.live.VpcId,
        })(payload),
      (params) => ec2().createRouteTable(params),
      get("RouteTable.RouteTableId"),
      tap((RouteTableId) =>
        pipe([
          fork({
            GatewayId: createRouteInternetGateway({ ig, RouteTableId }),
            SubnetId: associateRouteTableToSubnet({ subnet, RouteTableId }),
            NatGatewayId: createRouteNatGateway({ natGateway, RouteTableId }),
          }),
          () =>
            retryCall({
              name: `rt isUpById: ${name} id: ${RouteTableId}`,
              fn: () => isUpById({ id: RouteTableId }),
              config,
            }),
        ])()
      ),
      tap((RouteTableId) => {
        logger.info(`created rt ${tos({ name, RouteTableId })}`);
      }),
      (RouteTableId) => ({ id: RouteTableId }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#disassociateRouteTable-property
  const destroy = ({ id, name }) =>
    pipe([
      tap(() => {
        logger.info(`destroy route table ${tos({ name, id })}`);
      }),
      () => getById({ id }),
      tap.if(isEmpty, () => {
        throw Error(`Cannot get route tables: ${id}`);
      }),
      get("Associations"),
      filter(not(get("Main"))),
      map(async (association) => {
        logger.debug(`destroy disassociate ${tos({ association })}`);
        //TODO tryCatch
        await ec2().disassociateRouteTable({
          AssociationId: association.RouteTableAssociationId,
        });
      }),
      tap(() => {
        logger.debug(`destroying ${tos({ RouteTableId: id })}`);
      }),
      () => ec2().deleteRouteTable({ RouteTableId: id }),
      tap(() => {
        logger.debug(`destroyed ${tos({ name, id })}`);
      }),
    ])();

  const configDefault = async ({ name, properties }) =>
    defaultsDeep({
      TagSpecifications: [
        {
          ResourceType: "route-table",
          Tags: buildTags({ config, name }),
        },
      ],
    })(properties);

  const cannotBeDeleted = ({ resource, name }) => {
    logger.debug(`cannotBeDeleted name: ${name} ${tos({ resource })}`);
    return resource.RouteTableId === name;
  };

  return {
    type: "RouteTables",
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
