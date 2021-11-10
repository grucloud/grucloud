const assert = require("assert");
const {
  tap,
  get,
  pipe,
  filter,
  map,
  not,
  eq,
  tryCatch,
  fork,
  flatMap,
} = require("rubico");
const { defaultsDeep, first, find } = require("rubico/x");
const { retryCall } = require("@grucloud/core/Retry");

const logger = require("@grucloud/core/logger")({
  prefix: "RouteTableAssociation",
});
const { tos } = require("@grucloud/core/tos");
const { getByNameCore } = require("@grucloud/core/Common");
const { Ec2New, shouldRetryOnException } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");

exports.EC2RouteTableAssociation = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const ec2 = Ec2New(config);
  const findId = get("live.RouteTableAssociationId");

  const findName = ({ live, lives }) =>
    pipe([
      fork({
        routeTableName: pipe([
          () =>
            lives.getById({
              id: live.RouteTableId,
              providerName: config.providerName,
              type: "RouteTable",
              group: "EC2",
            }),
          get("name"),
        ]),
        subnetName: pipe([
          () =>
            lives.getById({
              id: live.SubnetId,
              providerName: config.providerName,
              type: "Subnet",
              group: "EC2",
            }),
          get("name"),
        ]),
      }),
      ({ routeTableName, subnetName }) =>
        `rt-assoc::${routeTableName}::${subnetName}`,
      tap((params) => {
        assert(true);
      }),
    ])();

  const findDependencies = ({ live }) => [
    { type: "RouteTable", group: "EC2", ids: [live.RouteTableId] },
    {
      type: "Subnet",
      group: "EC2",
      ids: [live.SubnetId],
    },
  ];

  const getList = ({ lives }) =>
    pipe([
      tap(() => {
        logger.info(`getList rt assoc`);
      }),
      () =>
        lives.getByType({
          type: "RouteTable",
          group: "EC2",
          providerName: config.providerName,
        }),
      flatMap(pipe([get("live.Associations"), filter(not(get("Main")))])),
      tap((params) => {
        assert(true);
      }),
    ])();

  const getByName = getByNameCore({ getList, findName });

  const getById = ({ RouteTableId, SubnetId }) =>
    pipe([
      () => ({ RouteTableIds: [RouteTableId] }),
      ec2().describeRouteTables,
      get("RouteTables"),
      first,
      get("Associations"),
      find(eq(get("SubnetId"), SubnetId)),
      tap((params) => {
        assert(true);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#associateRouteTable-property
  const create = ({ payload, name, dependencies, lives }) =>
    pipe([
      tap(() => {
        logger.info(`create associateRouteTable ${tos({ payload })}`);
      }),
      () => payload,
      ec2().associateRouteTable,
      tap((result) => {
        logger.debug(`created rt assoc ${JSON.stringify({ payload, result })}`);
      }),
      // Refresh the route table
      tap(() =>
        retryCall({
          name: `create rt assoc: ${name}`,
          fn: pipe([
            () => payload,
            getById,
            eq(get("AssociationState.State"), "associated"),
          ]),
          config,
        })
      ),
      tap(() => dependencies().routeTable.getLive({ lives })),
      tap(() => {
        logger.debug(`rt assoc updated ${JSON.stringify({ name })}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#disassociateRouteTable-property
  const destroy = ({ name, live }) =>
    pipe([
      tap(() => {
        logger.info(`destroy route table assoc ${JSON.stringify({ live })}`);
      }),
      () => live,
      ({ RouteTableAssociationId }) => ({
        AssociationId: RouteTableAssociationId,
      }),
      ec2().disassociateRouteTable,
      tap((result) => {
        logger.info(`rt assoc destroyed ${JSON.stringify({ name, result })}`);
      }),
    ])();

  const configDefault = ({
    name,
    namespace,
    properties = {},
    dependencies: { routeTable, subnet },
  }) =>
    pipe([
      tap(() => {
        assert(
          routeTable,
          "RouteTableAssociation is missing the dependency 'routeTable'"
        );
        assert(
          subnet,
          "RouteTableAssociation is missing the dependency 'subnet'"
        );
      }),
      () => properties,
      defaultsDeep({
        RouteTableId: getField(routeTable, "RouteTableId"),
        SubnetId: getField(subnet, "SubnetId"),
      }),
    ])();

  return {
    spec,
    findId,
    findName,
    findDependencies,
    getByName,
    //getById,
    getList,
    create,
    destroy,
    configDefault,
    shouldRetryOnException,
  };
};
