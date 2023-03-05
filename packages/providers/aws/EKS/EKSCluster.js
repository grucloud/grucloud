const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, map, not, omit } = require("rubico");
const { defaultsDeep, pluck, when, find } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "EKSCluster" });
const { tos } = require("@grucloud/core/tos");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

const {
  Tagger,
  kubeConfigUpdate,
  kubeConfigRemove,
  waitForUpdate,
} = require("./EKSCommon");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ name }) => {
    assert(name);
  }),
  pick(["name"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html
exports.EKSCluster = ({ compare }) => ({
  type: "Cluster",
  package: "eks",
  client: "EKS",
  inferName: () =>
    pipe([
      get("name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  inferName: () =>
    pipe([
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  dependencies: {
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("resourcesVpcConfig.subnetIds")]),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("resourcesVpcConfig.securityGroupIds")]),
      filterDependency:
        ({ resource }) =>
        (dependency) =>
          pipe([
            () => dependency,
            get("live.Tags"),
            not(find(eq(get("Key"), "aws:eks:cluster-name"))),
          ])(),
    },
    role: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => get("roleArn"),
    },
    kmsKeys: {
      type: "Key",
      group: "KMS",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("encryptionConfig"), map(get("provider.keyArn"))]),
    },
  },
  propertiesDefault: {
    resourcesVpcConfig: {
      endpointPublicAccess: true,
      endpointPrivateAccess: false,
    },
  },
  omitProperties: [
    "arn",
    "createdAt",
    "endpoint",
    "resourcesVpcConfig.clusterSecurityGroupId",
    "resourcesVpcConfig.vpcId",
    "resourcesVpcConfig.subnetIds",
    "resourcesVpcConfig.publicAccessCidrs",
    "kubernetesNetworkConfig",
    "identity",
    "logging",
    "status",
    "certificateAuthority",
    "clientRequestToken",
    "eks.2",
    "version",
    "platformVersion",
  ],
  compare: compare({}),
  filterLive: ({ providerConfig, lives }) =>
    pipe([
      pick(["name", "version", "encryptionConfig"]),
      when(
        get("encryptionConfig"),
        assign({
          encryptionConfig: pipe([
            get("encryptionConfig"),
            map(
              assign({
                provider: pipe([
                  get("provider"),
                  assign({
                    keyArn: pipe([
                      get("keyArn"),
                      replaceWithName({
                        groupType: "KMS::Key",
                        path: "id",
                        providerConfig,
                        lives,
                      }),
                    ]),
                  }),
                ]),
              })
            ),
          ]),
        })
      ),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#getCluster-property
  getById: {
    method: "describeCluster",
    getField: "cluster",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#listClusters-property
  getList: {
    method: "listClusters",
    getParam: "clusters",
    decorate: ({ getById }) => pipe([(name) => ({ name }), getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#createCluster-property
  create: {
    method: "createCluster",
    pickId,
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    isInstanceError: eq(get("status"), "FAILED"),
    isInstanceUp: eq(get("status"), "ACTIVE"),
    shouldRetryOnExceptionMessages: [
      "The KeyArn in encryptionConfig provider",
      "Role with arn: ",
    ],
    postCreate:
      ({ name, config }) =>
      () =>
        kubeConfigUpdate({ name, config }),
    configIsUp: { retryCount: 12 * 25, retryDelay: 5e3 },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#updateCluster-property
  update:
    ({ endpoint, getById }) =>
    async ({ name, payload, live, diff }) =>
      pipe([
        tap(() => {
          logger.info(`updateClusterConfig: ${name}`);
          //logger.debug(tos({ payload, diff, live }));
        }),
        () => payload,
        pick(["name", "clientRequestToken", "logging", "resourcesVpcConfig"]),
        omit([
          "resourcesVpcConfig.securityGroupIds",
          "resourcesVpcConfig.subnetIds",
        ]),
        endpoint().updateClusterConfig,
        get("update"),
        tap((result) => {
          logger.info(`updateClusterConfig: ${tos({ result })}`);
        }),
        get("id"),
        (updateId) =>
          waitForUpdate({ endpoint })({
            name,
            updateId: updateId,
          }),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#deleteCluster-property
  destroy: {
    method: "deleteCluster",
    pickId,
    ignoreErrorCodes: ["ResourceNotFoundException"],
    ignoreErrorMessages: ["No cluster found for name"],
    postDestroy: kubeConfigRemove,
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
    dependencies: { subnets, securityGroups, role },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(subnets, "missing 'subnets' dependency");
        assert(name);
      }),
      () => otherProps,
      defaultsDeep({
        resourcesVpcConfig: {
          subnetIds: map((subnet) => getField(subnet, "SubnetId"))(subnets),
        },
        tags: buildTagsObject({ config, namespace, name, userTags: tags }),
      }),
      when(
        () => securityGroups,
        defaultsDeep({
          resourcesVpcConfig: {
            securityGroupIds: map((sg) => getField(sg, "GroupId"))(
              securityGroups
            ),
          },
        })
      ),
      when(() => role, defaultsDeep({ roleArn: getField(role, "Arn") })),
    ])(),
});
