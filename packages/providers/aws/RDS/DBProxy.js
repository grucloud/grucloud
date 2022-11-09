const assert = require("assert");
const { map, pipe, tap, get, pick, assign, tryCatch } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./RDSCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const pickId = pick(["DBProxyName"]);

const decorate = ({ endpoint }) =>
  pipe([
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
  ]);

const model = {
  package: "rds",
  client: "RDS",
  ignoreErrorCodes: ["DBProxyNotFoundFault"],
  getById: {
    method: "describeDBProxies",
    pickId,
    getField: "DBProxies",
  },
  getList: {
    method: "describeDBProxies",
    getParam: "DBProxies",
    decorate,
  },
  create: {
    method: "createDBProxy",
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
  },
  update: { method: "modifyDBProxy" },
  destroy: { method: "deleteDBProxy", pickId },
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html
exports.DBProxy = ({ spec, config }) =>
  createAwsResource({
    model,
    spec,
    config,
    findName: get("live.DBProxyName"),
    findId: get("live.DBProxyArn"),
    getByName: ({ getById }) =>
      pipe([({ name }) => ({ DBProxyName: name }), getById({})]),
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
