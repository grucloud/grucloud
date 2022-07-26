const assert = require("assert");
const { map, pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./RDSCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pick(["DBProxyName", "TargetGroupName"]);

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

const model = {
  package: "rds",
  client: "RDS",
  ignoreErrorCodes: ["DBProxyNotFoundFault", "DBProxyTargetGroupNotFoundFault"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#describeDBProxyEndpoints-property
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
};

const managedByOther = pipe([get("live.IsDefault")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html
exports.DBProxyTargetGroup = ({ spec, config }) =>
  createAwsResource({
    model,
    spec,
    config,
    managedByOther,
    isDefault: managedByOther,
    cannotBeDeleted: managedByOther,
    findName: get("live.TargetGroupName"),
    findId: get("live.TargetGroupArn"),
    findDependencies: ({ live, lives }) => [
      {
        type: "DBProxy",
        group: "RDS",
        ids: [live.DBProxyName],
      },
      {
        type: "DBCluster",
        group: "RDS",
        ids: live.DBClusterIdentifiers,
      },
      {
        type: "DBInstance",
        group: "RDS",
        ids: live.DBInstanceIdentifiers,
      },
    ],
    getList: ({ client, endpoint, getById, config }) =>
      pipe([
        tap((params) => {
          assert(client);
          assert(endpoint);
          assert(getById);
          assert(config);
        }),
        () =>
          client.getListWithParent({
            parent: { type: "DBProxy", group: "RDS" },
            pickKey: pipe([pick(["DBProxyName"])]),
            method: "describeDBProxyTargetGroups",
            getParam: "TargetGroups",
            decorate,
            config,
          }),
        tap((params) => {
          assert(true);
        }),
      ])(),
    getByName: ({ getById }) =>
      pipe([({ name }) => ({ TargetGroupName: name }), getById]),
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { dbProxy, dbClusters, dbInstances },
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
