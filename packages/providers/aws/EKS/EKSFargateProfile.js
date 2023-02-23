const assert = require("assert");
const { pipe, tap, get, pick, eq, map } = require("rubico");
const { defaultsDeep, when, isIn } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./EKSCommon");

const buildArn = () =>
  pipe([
    get("fargateProfileArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ clusterName, fargateProfileName }) => {
    assert(clusterName);
    assert(fargateProfileName);
  }),
  pick(["clusterName", "fargateProfileName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html
exports.EKSFargateProfile = () => ({
  type: "FargateProfile",
  package: "eks",
  client: "EKS",
  propertiesDefault: {},
  omitProperties: [
    "clusterName",
    "status",
    "createdAt",
    "modifiedAt",
    "podExecutionRoleArn",
    "fargateProfileArn",
    "subnets",
  ],
  inferName:
    ({ dependenciesSpec: { cluster } }) =>
    ({ fargateProfileName }) =>
      pipe([
        tap((params) => {
          assert(cluster);
          assert(fargateProfileName);
        }),
        () => `${cluster}::${fargateProfileName}`,
      ])(),
  findName:
    () =>
    ({ clusterName, fargateProfileName }) =>
      pipe([() => `${clusterName}::${fargateProfileName}`])(),
  findId: () =>
    pipe([
      get("fargateProfileArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("podExecutionRoleArn"),
          tap((podExecutionRoleArn) => {
            assert(podExecutionRoleArn);
          }),
        ]),
    },
    cluster: {
      type: "Cluster",
      group: "EKS",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("clusterName"),
          lives.getByName({
            type: "Cluster",
            group: "EKS",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("subnets"),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#getFargateProfile-property
  getById: {
    method: "describeFargateProfile",
    getField: "fargateProfile",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#listFargateProfiles-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Cluster", group: "EKS" },
          pickKey: pipe([
            tap(({ name }) => {
              assert(name);
            }),
            ({ name }) => ({ clusterName: name }),
          ]),
          method: "listFargateProfiles",
          getParam: "fargateProfileNames",
          config,
          decorate: ({ parent }) =>
            pipe([
              (fargateProfileName) => ({
                fargateProfileName,
                clusterName: parent.name,
              }),
              getById({}),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#createFargateProfile-property
  create: {
    method: "createFargateProfile",
    pickCreated: ({ payload }) => pipe([get("fargateProfile")]),
    isInstanceUp: pipe([get("status"), isIn(["ACTIVE"])]),
    isInstanceError: pipe([eq(get("status"), "CREATE_FAILED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#deleteFargateProfile-property
  destroy: {
    method: "deleteFargateProfile",
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
    properties: { Tags, ...otherProps },
    dependencies: { cluster, iamRole, subnets },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(cluster);
      }),
      () => otherProps,
      defaultsDeep({
        clusterName: getField(cluster, "name"),
        tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
      when(
        () => iamRole,
        defaultsDeep({
          podExecutionRoleArn: getField(iamRole, "Arn"),
        })
      ),
      when(
        () => subnets,
        defaultsDeep({
          subnets: pipe([
            () => subnets,
            map((subnet) => getField(subnet, "SubnetId")),
          ])(),
        })
      ),
    ])(),
});
