const assert = require("assert");
const { pipe, tap, get, eq, pick, switchCase } = require("rubico");
const { defaultsDeep, find, identity } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { getByNameCore } = require("@grucloud/core/Common");

const { Tagger } = require("./EMRContainersCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const pickId = pipe([
  pick(["id"]),
  tap(({ id }) => {
    assert(id);
  }),
]);

const buildArn = () =>
  pipe([
    get("arn"),
    tap((id) => {
      assert(id);
    }),
  ]);

exports.EMRContainersVirtualCluster = ({}) => ({
  type: "VirtualCluster",
  package: "emr-containers",
  client: "EMRContainers",
  inferName: () =>
    pipe([
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findName: () =>
    pipe([
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () => pipe([get("id")]),
  ignoreErrorCodes: ["ResourceNotFoundException", "ValidationException"],
  omitProperties: ["arn", "id", "createdAt", "state", "containerProvider.id"],
  propertiesDefault: {},
  dependencies: {
    eksCluster: {
      type: "Cluster",
      group: "EKS",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("containerProvider.id"),
          (id) =>
            pipe([
              lives.getByType({
                type: "Cluster",
                group: "EKS",
                providerName: config.providerName,
              }),
              find(eq(get("live.id"), id)),
              get("id"),
            ])(),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMRContainers.html#describeVirtualCluster-property
  getById: {
    method: "describeVirtualCluster",
    getField: "virtualCluster",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMRContainers.html#listVirtualClusters-property
  getList: {
    method: "listVirtualClusters",
    getParam: "virtualClusters",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMRContainers.html#createVirtualCluster-property
  create: {
    method: "createVirtualCluster",
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: pipe([eq(get("state"), "RUNNING")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMRContainers.html#updateVirtualCluster-property
  update: {
    method: "updateVirtualCluster",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, defaultsDeep({ id: live.id })])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMRContainers.html#deleteVirtualCluster-property
  destroy: {
    method: "deleteVirtualCluster",
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
    dependencies: { eksCluster },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({
          name,
          config,
          namespace,
          userTags: tags,
        }),
      }),
      switchCase([
        () => eksCluster,
        defaultsDeep({
          containerProvider: {
            id: getField(eksCluster, "id"),
          },
        }),
        () => {
          assert(false, "missing eks cluster");
        },
      ]),
    ])(),
});
