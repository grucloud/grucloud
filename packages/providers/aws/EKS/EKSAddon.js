const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, when, isIn } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./EKSCommon");

const buildArn = () =>
  pipe([
    get("addonArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ clusterName, addonName }) => {
    assert(clusterName);
    assert(addonName);
  }),
  pick(["clusterName", "addonName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html
exports.EKSAddon = () => ({
  type: "Addon",
  package: "eks",
  client: "EKS",
  propertiesDefault: {},
  omitProperties: [
    "addonArn",
    "clusterName",
    "health",
    "status",
    "createdAt",
    "modifiedAt",
    "serviceAccountRoleArn",
  ],
  inferName:
    ({ dependenciesSpec: { cluster } }) =>
    ({ addonName }) =>
      pipe([
        tap((params) => {
          assert(cluster);
          assert(addonName);
        }),
        () => `${cluster}::${addonName}`,
      ])(),
  findName:
    () =>
    ({ clusterName, addonName }) =>
      pipe([() => `${clusterName}::${addonName}`])(),
  findId: () =>
    pipe([
      get("addonArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  // compare: compare({
  //   filterTarget: () => pipe([omit(["compare"])]),
  // }),
  dependencies: {
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
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#getAddon-property
  getById: {
    method: "describeAddon",
    getField: "addon",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#listAddons-property
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
            tap((params) => {
              assert(true);
            }),
          ]),
          method: "listAddons",
          getParam: "addons",
          config,
          decorate: ({ parent }) =>
            pipe([
              (addonName) => ({ addonName, clusterName: parent.name }),
              tap((params) => {
                assert(getById);
              }),
              getById({}),
              tap((params) => {
                assert(true);
              }),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#createAddon-property
  create: {
    method: "createAddon",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([get("status"), isIn(["ACTIVE", "DEGRADED"])]),
    isInstanceError: pipe([eq(get("status"), "CREATE_FAILED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#updateAddon-property
  update: {
    method: "updateAddon",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#deleteAddon-property
  destroy: {
    method: "deleteAddon",
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
    dependencies: { cluster, iamRole },
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
          serviceAccountRoleArn: getField(iamRole, "Arn"),
        })
      ),
    ])(),
});
