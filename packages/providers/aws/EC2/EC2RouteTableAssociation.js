const assert = require("assert");
const { tap, get, pipe, filter, not, eq, fork, flatMap } = require("rubico");
const { defaultsDeep, find } = require("rubico/x");
const { retryCall } = require("@grucloud/core/Retry");

const logger = require("@grucloud/core/logger")({
  prefix: "RouteTableAssociation",
});
const { tos } = require("@grucloud/core/tos");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const { createEC2 } = require("./EC2Common");

exports.EC2RouteTableAssociation = ({ spec, config }) => {
  const ec2 = createEC2(config);
  const client = AwsClient({ spec, config })(ec2);

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
            () => ({ lives }),
            dependencies().routeTable.getLive,
            tap((params) => {
              assert(true);
            }),
            get("Associations"),
            find(eq(get("SubnetId"), payload.SubnetId)),
            eq(get("AssociationState.State"), "associated"),
          ]),
          config,
        })
      ),
      tap(() => {
        logger.info(`rt assoc updated ${JSON.stringify({ name })}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#disassociateRouteTable-property
  const destroy = client.destroy({
    pickId: ({ RouteTableAssociationId }) => ({
      AssociationId: RouteTableAssociationId,
    }),
    method: "disassociateRouteTable",
    //getById,
    ignoreErrorCodes: ["InvalidAssociationID.NotFound"],
    config,
  });

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
    getList,
    create,
    destroy,
    configDefault,
  };
};
