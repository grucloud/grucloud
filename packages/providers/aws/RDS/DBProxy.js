const assert = require("assert");
const { map, pipe, tap, get, pick, assign, tryCatch } = require("rubico");
const { defaultsDeep, when, pluck } = require("rubico/x");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./RDSCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const model = {
  package: "rds",
  client: "RDS",
  pickIds: ["DBProxyName"],
  ignoreErrorCodes: ["DBProxyNotFoundFault"],
  getById: { method: "describeDBProxies", getField: "DBProxies" },
  getList: { method: "describeDBProxies", getParam: "DBProxies" },
  create: { method: "createDBProxy" },
  update: { method: "modifyDBProxy" },
  destroy: { method: "deleteDBProxy" },
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html
exports.DBProxy = ({ spec, config }) =>
  createAwsResource({
    model,
    spec,
    config,
    findName: get("live.DBProxyName"),
    findId: get("live.DBProxyArn"),
    findDependencies: ({ live, lives }) => [
      {
        type: "Secret",
        group: "SecretsManager",
        ids: pipe([() => live, get("Auth"), pluck("SecretArn")])(),
      },
      {
        type: "Subnet",
        group: "EC2",
        ids: live.VpcSubnetIds,
      },
      {
        type: "SecurityGroup",
        group: "EC2",
        ids: live.VpcSecurityGroupIds,
      },
      {
        type: "Role",
        group: "IAM",
        ids: [live.RoleArn],
      },
    ],
    decorate: ({ endpoint }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        assign({
          // 1. create proxy
          // 2. listTagsForResource may return DBProxyNotFoundFault
          Tags: tryCatch(
            pipe([
              ({ DBProxyArn }) => ({
                ResourceName: DBProxyArn,
              }),
              endpoint().listTagsForResource,
              get("TagList"),
            ]),
            () => undefined
          ),
        }),
      ]),
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    getByName: ({ getById }) =>
      pipe([({ name }) => ({ DBProxyName: name }), getById]),
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { subnets, securityGroups, role },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          DBProxyName: name,
          Tags: buildTags({ name, config, namespace, UserTags: Tags }),
          VpcSubnetIds: pipe([
            () => subnets,
            map((subnet) => getField(subnet, "SubnetId")),
          ])(),
          RoleArn: getField(role, "Arn"),
        }),
        when(
          () => securityGroups,
          defaultsDeep({
            VpcSecurityGroupIds: pipe([
              () => securityGroups,
              map((securityGroup) => getField(securityGroup, "GroupId")),
            ])(),
          })
        ),
      ])(),
  });
