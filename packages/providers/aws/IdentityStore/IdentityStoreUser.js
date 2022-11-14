const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  assign,
  map,
  and,
  or,
  not,
  filter,
} = require("rubico");
const {
  defaultsDeep,
  first,
  pluck,
  callProp,
  when,
  isEmpty,
  unless,
  identity,
} = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { replaceWithName } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

const pickId = pipe([
  tap(({ IdentityStoreId, UserId }) => {
    assert(IdentityStoreId);
    assert(UserId);
  }),
  pick(["IdentityStoreId", "UserId"]),
]);

const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(live);
    }),
    defaultsDeep({ InstanceArn: live.InstanceArn }),

    //({ name, ...other }) => ({ loadBalancerName: name, ...other }),
    //assign({ MyJSON: pipe([get("MyJSON", JSON.parse)]) }),
    //assignTags({ endpoint }),
  ]);

////////////////////
// managedByOther
////////////////////

// const managedByOther = pipe([eq(get("live.Type"), "managed")]);

// const managedByOther = pipe([
//   get("live.CacheParameterGroupName"),
//   callProp("startsWith", "default."),
// ]);

// const managedByOther = ({ live, lives }) =>
//   pipe([
//     () =>
//       lives.getById({
//         type: "LoadBalancer",
//         group: "ElasticLoadBalancingV2",
//         providerName: config.providerName,
//         id: live.LoadBalancerArn,
//       }),
//     get("managedByOther"),
//   ])();

////////////////////
// cannotBeDeleted
////////////////////

//  const cannotBeDeleted = pipe([get("live"), eq(get("status"), "INACTIVE")]);

// const cannotBeDeleted = pipe([
//   get("live"),
//   get("autoEnable"),
//   (autoEnable) =>
//     isDeepEqual(autoEnable, {
//       ec2: false,
//       ecr: false,
//     }),
// ]);

// const cannotBeDeleted = pipe([
//   get("live.Path"),
//   or([includes("/aws-service-role"), includes("/aws-reserved/")]),
// ]);

const model = ({ config }) => ({
  package: "identitystore",
  client: "Identitystore",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  //managedByOther,
  //cannotBeDeleted
  // ignoreErrorMessages: [
  //   "The specified cluster is inactive. Specify an active cluster and try again.",
  // ],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IdentityStore.html#describeUser-property
  getById: {
    method: "describeUser",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IdentityStore.html#listUsers-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IdentityStore.html#createUser-property
  create: {
    // filterPayload: ({ Tags, ...other }) =>
    //   pipe([() => ({ ...other, BackupVaultTags: Tags })])(),
    //filterPayload: pipe([omit(SELECTORS)]),

    method: "createUser",
    pickCreated: ({ payload }) => pipe([identity]),

    // isInstanceUp: pipe([eq(get("Status"), "OPERATIONAL")]),
    // isInstanceError: pipe([eq(get("Status"), "ACTION_NEEDED")]),
    // getErrorMessage: get("StatusMessage", "error"),

    // shouldRetryOnExceptionCodes: [],
    // shouldRetryOnExceptionMessages: [],

    // postCreate: ({ name, payload }) =>
    //   pipe([tap(createAlias({ name })), tap(putKeyPolicy(payload))]),

    // postCreate: ({ resolvedDependencies: { secret } }) =>
    //   pipe([
    //     when(
    //       () => secret,
    //       pipe([
    //         ({ DBClusterIdentifier, Endpoint, Port }) => ({
    //           SecretId: secret.live.Name,
    //         }),
    //         secretEndpoint().putSecretValue,
    //       ])
    //     ),
    //   ]),

    // postCreate:
    //   ({ endpoint, payload, created }) =>
    //   (live) =>
    //     pipe([
    //       () => payload,
    //       tap.if(
    //         get("AcceleratorAttributes.FlowLogsS3Bucket"),
    //         pipe([updateAcceleratorAttributes({ endpoint, live })])
    //       ),
    //     ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IdentityStore.html#updateUser-property
  update: {
    method: "updateUser",
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([
        () => payload,
        // assign({
        //   SecretId: () => live.ARN,
        // }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IdentityStore.html#deleteUser-property
  destroy: {
    // preDestroy: ({ endpoint, live }) =>
    //   pipe([
    //     () => live,
    //     get("apiStages"),
    //     map(({ apiId, stage }) => ({
    //       op: "remove",
    //       path: "/apiStages",
    //       value: `${apiId}:${stage}`,
    //     })),
    //     unless(
    //       isEmpty,
    //       pipe([
    //         (patchOperations) => ({
    //           usagePlanId: live.id,
    //           patchOperations,
    //         }),
    //         endpoint().updateUsagePlan,
    //       ])
    //     ),
    //   ])(),
    // postDestroy: pipe([
    //   tap((params) => {
    //     assert(true);
    //   }),
    //   pickId,
    //   defaultsDeep({ PendingWindowInDays: 7 }),
    //   (params) => kms().scheduleKeyDeletion(params),
    // ]),
    method: "deleteUser",
    pickId,
    // isInstanceDown: pipe([eq(get("status"), "INACTIVE")]),
    // ignoreErrorCodes: ["ClusterNotFoundException"],
    // ignoreErrorMessages: [
    //   "The specified cluster is inactive. Specify an active cluster and try again.",
    // ],
    // shouldRetryOnExceptionCodes: [],
    // shouldRetryOnExceptionMessages: [],
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IdentityStore.html
exports.IdentityStoreUser = ({ compare }) => ({
  type: "User",
  propertiesDefault: {},
  omitProperties: ["UserId", "IdentityStoreId", "InstanceArn"],
  // TODO prefix with store name ?
  inferName: pipe([
    get("properties.UserName"),
    tap((UserName) => {
      assert(UserName);
    }),
  ]),

  // inferName: ({
  //   properties: { certificateName },
  //   dependenciesSpec: { loadBalancer },
  // }) =>
  //   pipe([
  //     tap((params) => {
  //       assert(loadBalancer);
  //       assert(certificateName);
  //     }),
  //     () => `${loadBalancer}::${certificateName}`,
  //   ])(),

  // inferName: pipe([
  //   get("dependenciesSpec"),
  //   ({ staticIp, instance }) => `${staticIp}::${instance}`,
  // ]),

  // environmentVariables: [
  //   { path: "masterUsername", suffix: "MASTER_USERNAME" },
  //   { path: "masterUserPassword", suffix: "MASTER_USER_PASSWORD" },
  // ],

  // compare: compare({
  //   filterTarget: () => pipe([omit(["compare"])]),
  // }),
  dependencies: {
    identityStore: {
      type: "Instance",
      group: "SSOAdmin",
      parent: true,
      //excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),

          get("InstanceArn"),
          tap((InstanceArn) => {
            assert(InstanceArn);
          }),
        ]),
    },
  },
  Client: ({ spec, config }) =>
    createAwsResource({
      model: model({ config }),
      spec,
      config,
      // TODO prefix with store name ?
      findName: pipe([
        get("live"),
        get("UserName"),
        tap((name) => {
          assert(name);
        }),
      ]),
      // TODO prefix with store id ?
      findId: pipe([
        get("live"),
        get("UserId"),
        tap((id) => {
          assert(id);
        }),
      ]),
      getByName: getByNameCore,
      // getByName: ({ getById }) =>
      //   pipe([({ name }) => ({ ConnectionName: name }), getById({})]),
      getList: ({ client, endpoint, getById, config }) =>
        pipe([
          () =>
            client.getListWithParent({
              parent: { type: "Instance", group: "SSOAdmin" },
              pickKey: pipe([
                tap((params) => {
                  assert(true);
                }),
                pick(["IdentityStoreId", "InstanceArn"]),
              ]),
              method: "listUsers",
              getParam: "Users",
              config,
              decorate: ({ parent }) =>
                pipe([
                  tap((params) => {
                    assert(parent);
                  }),
                  defaultsDeep({ InstanceArn: parent.InstanceArn }),
                ]),
            }),
        ])(),
      configDefault: ({
        name,
        namespace,
        properties: { Tags, ...otherProps },
        dependencies: { identityStore },
      }) =>
        pipe([
          tap((params) => {
            assert(identityStore);
          }),
          () => otherProps,
          defaultsDeep({
            IdentityStoreId: getField(identityStore, "IdentityStoreId"),
          }),
        ])(),
    }),
});
