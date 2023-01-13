const assert = require("assert");
const { map, pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, when, callProp } = require("rubico/x");

const { buildTags } = require("../AwsCommon");
const { Tagger } = require("./RDSCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ DBProxyName, TargetGroupName }) => {
    assert(DBProxyName);
    assert(TargetGroupName);
  }),
  pick(["DBProxyName", "TargetGroupName"]),
]);

const buildArn = () =>
  pipe([
    get("TargetGroupArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const decorate = ({ endpoint }) =>
  pipe([
    assign({
      Tags: pipe([
        ({ TargetGroupArn }) => ({
          ResourceName: TargetGroupArn,
        }),
        endpoint().listTagsForResource,
        get("TagList"),
      ]),
    }),
  ]);

const managedByOther = () => pipe([get("IsDefault")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html
exports.RDSDBProxyTargetGroup = () => ({
  type: "DBProxyTargetGroup",
  package: "rds",
  client: "RDS",
  ignoreErrorCodes: ["DBProxyNotFoundFault", "DBProxyTargetGroupNotFoundFault"],
  managedByOther,
  isDefault: managedByOther,
  cannotBeDeleted: managedByOther,
  inferName:
    ({ dependenciesSpec: { dbProxy } }) =>
    ({ TargetGroupName }) =>
      pipe([
        tap((params) => {
          assert(dbProxy);
          assert(TargetGroupName);
        }),
        () => `${dbProxy}::${TargetGroupName}`,
      ]),
  findName: () =>
    pipe([
      ({ DBProxyName, TargetGroupName }) =>
        `${DBProxyName}::${TargetGroupName}`,
    ]),
  findId: () => get("TargetGroupArn"),
  dependencies: {
    dbProxy: {
      type: "DBProxy",
      group: "RDS",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("DBProxyName"),
          lives.getByName({
            type: "DBProxy",
            group: "RDS",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
    dbClusters: {
      type: "DBCluster",
      group: "RDS",
      list: true,
      dependencyIds: ({ lives, config }) => get("DBClusterIdentifiers"),
    },
    dbInstances: {
      type: "DBInstance",
      group: "RDS",
      list: true,
      dependencyIds: ({ lives, config }) => get("DBInstanceIdentifiers"),
    },
  },
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "DBProxy", group: "RDS" },
          pickKey: pipe([pick(["DBProxyName"])]),
          method: "describeDBProxyTargetGroups",
          getParam: "TargetGroups",
          decorate,
          config,
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#describeDBProxyTargetGroups-property
  getById: {
    method: "describeDBProxyTargetGroups",
    pickId,
    getField: "TargetGroups",
    decorate,
  },
  create: {
    method: "registerDBProxyTargets",
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
  },
  update: { method: "modifyDBProxyTargetGroup" },
  destroy: { method: "deregisterDBProxyTargets", pickId },
  getByName: ({ getById }) =>
    pipe([
      get("name"),
      callProp("split", "::"),
      ([DBProxyName, TargetGroupName]) => ({ DBProxyName, TargetGroupName }),
      getById({}),
    ]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { dbProxy, dbClusters, dbInstances },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        DBProxyName: getField(dbProxy, "DBProxyName"),
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => dbClusters,
        defaultsDeep({
          DBClusterIdentifiers: pipe([
            () => clusters,
            map((cluster) => getField(cluster, "DBClusterIdentifier")),
          ])(),
        })
      ),
      when(
        () => dbInstances,
        defaultsDeep({
          DBInstanceIdentifiers: pipe([
            () => dbInstances,
            map((instance) => getField(instance, "DBInstanceIdentifier")),
          ])(),
        })
      ),
    ])(),
});
