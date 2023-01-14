const assert = require("assert");
const { map, pipe, tap, get, pick, assign, tryCatch } = require("rubico");
const { defaultsDeep, when, pluck } = require("rubico/x");

const { buildTags } = require("../AwsCommon");
const { replaceWithName } = require("@grucloud/core/Common");

const { Tagger } = require("./RDSCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const pickId = pick(["DBProxyName"]);

const buildArn = () =>
  pipe([
    get("DBProxyArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

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

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html
exports.RDSDBProxy = () => ({
  type: "DBProxy",
  package: "rds",
  client: "RDS",
  ignoreErrorCodes: ["DBProxyNotFoundFault"],
  inferName: () => get("DBProxyName"),
  findName: () => get("DBProxyName"),
  findId: () => get("DBProxyArn"),
  omitProperties: [
    "DBProxyArn",
    "VpcSubnetIds",
    "VpcSecurityGroupIds",
    "RoleArn",
    "VpcId",
    "CreatedDate",
    "UpdatedDate",
    "Status",
    "Endpoint",
  ],
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      when(
        get("Auth"),
        assign({
          Auth: pipe([
            get("Auth"),
            map(
              when(
                get("SecretArn"),
                assign({
                  SecretArn: pipe([
                    get("SecretArn"),
                    replaceWithName({
                      groupType: "SecretsManager::Secret",
                      pathLive: "id",
                      path: "id",
                      providerConfig,
                      lives,
                    }),
                  ]),
                })
              )
            ),
          ]),
        })
      ),
    ]),
  dependencies: {
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("VpcSubnetIds"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("VpcSecurityGroupIds"),
    },
    secrets: {
      type: "Secret",
      group: "SecretsManager",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("Auth"), pluck("SecretArn")]),
    },
    role: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => get("RoleArn"),
    },
  },
  getById: {
    method: "describeDBProxies",
    pickId,
    getField: "DBProxies",
    decorate,
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
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ DBProxyName: name }), getById({})]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { subnets, securityGroups, role },
    config,
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
