const assert = require("assert");
const {
  tap,
  get,
  pipe,
  filter,
  map,
  eq,
  any,
  tryCatch,
  switchCase,
  pick,
  fork,
} = require("rubico");
const { defaultsDeep, first, callProp, last } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "EC2RouteTable" });
const { tos } = require("@grucloud/core/tos");
const { getByIdCore, buildTags, throwIfNotAwsError } = require("../AwsCommon");
const { findNameInTagsOrId, findNamespaceInTags } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const { createEC2, tagResource, untagResource } = require("./EC2Common");

const extractRouteTableName = pipe([callProp("split", "::"), last]);

exports.EC2RouteTable = ({ spec, config }) => {
  const endpoint = createEC2(config);
  const client = AwsClient({ spec, config })(endpoint);

  const findId = () => get("RouteTableId");
  const pickId = pick(["RouteTableId"]);

  const isDefault = () => pipe([get("Associations"), any(get("Main"))]);

  const findName = ({ lives, config }) =>
    pipe([
      fork({
        vpcName: (live) =>
          pipe([
            () =>
              lives.getById({
                id: live.VpcId,
                type: "Vpc",
                group: "EC2",
                providerName: config.providerName,
              }),
            get("name"),
            tap((name) => {
              assert(
                name,
                `no vpc name in route table id ${live.RouteTableId}, VpcId: ${live.VpcId}`
              );
            }),
          ])(),
        rtbName: switchCase([
          isDefault({ lives, config }),
          pipe([() => "rt-default"]),
          findNameInTagsOrId({ findId })({ lives, config }),
        ]),
      }),
      ({ vpcName, rtbName }) => `${vpcName}::${rtbName}`,
    ]);

  const routesDelete = () => (live) =>
    pipe([
      () => live,
      get("Routes"),
      filter(eq(get("State"), "blackhole")),
      map(
        tryCatch(
          pipe([
            tap((Route) => {
              assert(Route);
            }),
            pick(["DestinationCidrBlock", "DestinationIpv6CidrBlock"]),
            defaultsDeep({ RouteTableId: live.RouteTableId }),
            tryCatch(
              endpoint().deleteRoute,
              throwIfNotAwsError("InvalidRoute.NotFound")
            ),
          ]),
          (error, Route) =>
            pipe([
              tap(() => {
                logger.error(`error deleteRoute ${tos({ Route, error })}`);
              }),
              () => ({ error, Route }),
            ])()
        )
      ),
      tap.if(any(get("error")), (result) => {
        throw result;
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeRouteTables-property
  const getList = client.getList({
    method: "describeRouteTables",
    getParam: "RouteTables",
  });

  const getByName = ({ name, isDefault, resolvedDependencies }) =>
    pipe([
      tap((params) => {
        assert(resolvedDependencies);
      }),
      () => resolvedDependencies,
      switchCase([
        get("vpc"),
        get("vpc.live.VpcId"),
        get("routeTable"),
        get("routeTable.live.VpcId"),
        () => {
          assert(false, "no vpc or route table dependencies");
        },
      ]),
      tap((VpcId) => {
        assert(VpcId);
      }),
      fork({
        filterName: switchCase([
          () => isDefault,
          () => ({ Name: "association.main", Values: [true] }),
          () => ({ Name: "tag:Name", Values: [extractRouteTableName(name)] }),
        ]),
        filterVpc: (VpcId) => ({
          Name: "vpc-id",
          Values: [VpcId],
        }),
      }),
      ({ filterName, filterVpc }) => ({ Filters: [filterName, filterVpc] }),
      endpoint().describeRouteTables,
      get("RouteTables"),
      first,
    ])();

  const getById = () =>
    pipe([
      ({ RouteTableId }) => ({ id: RouteTableId }),
      getByIdCore({ fieldIds: "RouteTableIds", getList }),
    ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createRouteTable-property
  const create = client.create({
    method: "createRouteTable",
    pickCreated: () => get("RouteTable"),
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#disassociateRouteTable-property
  const destroy = client.destroy({
    pickId,
    preDestroy: routesDelete,
    method: "deleteRouteTable",
    getById,
    ignoreErrorCodes: ["InvalidRouteTableID.NotFound"],
  });

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otheProps },
    dependencies: { vpc },
  }) =>
    pipe([
      tap(() => {
        assert(vpc, "RouteTable is missing the dependency 'vpc'");
      }),
      () => otheProps,
      defaultsDeep({
        VpcId: getField(vpc, "VpcId"),
        TagSpecifications: [
          {
            ResourceType: "route-table",
            Tags: buildTags({
              config,
              namespace,
              name: extractRouteTableName(name),
              UserTags: Tags,
            }),
          },
        ],
      }),
    ])();

  const cannotBeDeleted = isDefault;

  return {
    spec,
    isDefault,
    managedByOther: isDefault,
    findId,
    findName,
    findNamespace: findNamespaceInTags,
    getByName,
    getById,
    cannotBeDeleted,
    getList,
    create,
    destroy,
    configDefault,
    tagResource: tagResource({ endpoint }),
    untagResource: untagResource({ endpoint }),
  };
};
