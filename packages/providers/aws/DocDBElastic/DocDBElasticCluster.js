const assert = require("assert");
const { pipe, tap, get, pick, map, eq, omit } = require("rubico");
const { defaultsDeep, isIn, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./DocDBElasticCommon");

const buildArn = () =>
  pipe([
    get("clusterArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ clusterArn }) => {
    assert(clusterArn);
  }),
  pick(["clusterArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
    when(
      //
      eq(get("kmsKeyId"), "AWS_OWNED_KMS_KEY"),
      omit(["kmsKeyId"])
    ),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDBElastic.html
exports.DocDBElasticCluster = () => ({
  type: "Cluster",
  package: "docdb-elastic",
  client: "DocDBElastic",
  propertiesDefault: {},
  omitProperties: [
    "clusterArn",
    "status",
    "clusterEndpoint",
    "createTime",
    "shards",
  ],
  inferName: () =>
    pipe([
      get("clusterName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("clusterName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("clusterArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException", "ValidationException"],
  environmentVariables: [
    { path: "adminUserPassword", suffix: "ADMIN_USER_PASSWORD" },
  ],
  dependencies: {
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      pathId: "kmsKeyId",
      dependencyId: ({ lives, config }) => get("kmsKeyId"),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      pathId: "subnetIds",
      dependencyIds: ({ lives, config }) => get("subnetIds"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      pathId: "vpcSecurityGroupIds",
      dependencyIds: ({ lives, config }) => get("vpcSecurityGroupIds"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDBElastic.html#getCluster-property
  getById: {
    method: "getCluster",
    getField: "cluster",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDBElastic.html#listClusters-property
  getList: {
    method: "listClusters",
    getParam: "clusters",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDBElastic.html#createCluster-property
  create: {
    method: "createCluster",
    pickCreated: ({ payload }) => pipe([get("cluster")]),
    isInstanceUp: pipe([get("status"), isIn(["ACTIVE"])]),
    isInstanceError: pipe([
      get("status"),
      isIn([
        "VPC_ENDPOINT_LIMIT_EXCEEDED",
        "IP_ADDRESS_LIMIT_EXCEEDED",
        "INVALID_SECURITY_GROUP_ID",
        "INVALID_SUBNET_ID",
        "INACCESSIBLE_ENCRYPTION_CREDS",
      ]),
    ]),
    // getErrorMessage: pipe([get("StateChangeReason.Message", "FAILED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDBElastic.html#updateCluster-property
  update: {
    method: "updateCluster",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDBElastic.html#deleteCluster-property
  destroy: {
    method: "deleteCluster",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { kmsKey, securityGroups, subnets },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, UserTags: tags }),
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          kmsKeyId: getField(kmsKey, "Arn"),
        })
      ),
      when(
        () => subnets,
        defaultsDeep({
          subnetIds: pipe([
            () => subnets,
            map((subnet) => getField(subnet, "SubnetId")),
          ])(),
        })
      ),
      when(
        () => securityGroups,
        defaultsDeep({
          vpcSecurityGroupIds: pipe([
            () => securityGroups,
            map((sg) => getField(sg, "GroupId")),
          ])(),
        })
      ),
    ])(),
});
