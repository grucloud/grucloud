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
const { defaultsDeep, prepend, callProp, last } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "EC2RouteTable" });
const { tos } = require("@grucloud/core/tos");
const { getByIdCore, buildTags } = require("../AwsCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { findNameInTagsOrId, findNamespaceInTags } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const {
  createEC2,
  findDependenciesVpc,
  findDependenciesSubnet,
  tagResource,
  untagResource,
} = require("./EC2Common");

const extractRouteTableName = pipe([callProp("split", "::"), last]);

exports.EC2RouteTable = ({ spec, config }) => {
  const ec2 = createEC2(config);
  const client = AwsClient({ spec, config })(ec2);
  const { providerName } = config;

  const findId = get("live.RouteTableId");
  const pickId = pick(["RouteTableId"]);

  const isDefault = ({ live, lives }) =>
    pipe([() => live, get("Associations"), any(get("Main"))])();

  const findName = pipe([
    fork({
      vpcName: ({ live, lives, config }) =>
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
            assert(name, "no vpc name in route table");
          }),
        ])(),
      rtbName: switchCase([
        isDefault,
        pipe([() => "rt-default"]),
        findNameInTagsOrId({ findId }),
      ]),
    }),
    ({ vpcName, rtbName }) => `${vpcName}::${rtbName}`,
  ]);

  const findDependencies = ({ live }) => [
    findDependenciesVpc({ live }),
    findDependenciesSubnet({ live }),
  ];

  const routesDelete = ({ live }) =>
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
            //TODO ipv6
            ({ DestinationCidrBlock }) => ({
              RouteTableId: live.RouteTableId,
              DestinationCidrBlock: DestinationCidrBlock,
            }),
            ec2().deleteRoute,
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
    decorate: () =>
      pipe([
        tap((params) => {
          assert(true);
        }),
      ]),
  });

  const getByName = getByNameCore({ getList, findName });
  const getById = pipe([
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
    findDependencies,
    findNamespace: findNamespaceInTags(config),
    getByName,
    getById,
    cannotBeDeleted,
    getList,
    create,
    destroy,
    configDefault,
    tagResource: tagResource({ endpoint: ec2 }),
    untagResource: untagResource({ endpoint: ec2 }),
  };
};
