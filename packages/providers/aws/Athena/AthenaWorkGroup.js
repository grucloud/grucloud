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
} = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { buildTagsObject } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

const { Tagger } = require("./AthenaCommon");

const ignoreErrorMessages = ["not found"];

//////////////
// buildArn
//////////////

const buildArn =
  ({ region, accountId }) =>
  ({ WorkGroup }) =>
    `arn:aws:athena:${region}:${accountId()}:workgroup/${WorkGroup}`;
//////////
// pickId
//////////

// const pickId = pipe([
//   tap(({ Name }) => {
//     assert(Name);
//   }),
//   ({ Name }) => ({ WorkGroup: Name }),
// ]);

const pickId = pipe([
  tap(({ WorkGroup }) => {
    assert(WorkGroup);
  }),
  pick(["WorkGroup"]),
]);

//////////
// decorate
//////////
const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    ({ Name }) => ({ WorkGroup: Name }),
    //({ name, ...other }) => ({ loadBalancerName: name, ...other }),
    //assign({ MyJSON: pipe([get("MyJSON", JSON.parse)]) }),
    //assignTags({ endpoint }),
  ]);
////////////////////
// managedByOther
////////////////////

const cannotBeDeleted = pipe([get("live"), eq(get("WorkGroup"), "primary")]);

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
  package: "athena",
  client: "Athena",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  //managedByOther,
  //cannotBeDeleted
  // ignoreErrorMessages: [
  //   "The specified cluster is inactive. Specify an active cluster and try again.",
  // ],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html#getWorkGroup-property
  getById: {
    method: "getWorkGroup",
    getField: "WorkGroup",
    pickId,
    decorate,
    ignoreErrorMessages,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html#listWorkGroups-property
  getList: {
    //enhanceParams: () => () => ({ AlarmTypes: ["MetricAlarm"] }),
    //transformListPre: () => pipe([filter(not(isInstanceDown))]),
    // transformListPost: () =>
    //   pipe([
    //     callProp("sort", (a, b) => {
    //       return moment(b.CreationDate).isAfter(a.CreationDate) ? 1 : -1;
    //     }),
    //   ]),
    //filterResource: pipe([not(eq(get("State"), "deleted"))]),

    method: "listWorkGroups",
    getParam: "WorkGroups",
    decorate: ({ getById }) =>
      pipe([({ Name }) => ({ WorkGroup: Name }), getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html#createWorkGroup-property
  create: {
    filterPayload: ({ WorkGroup, ...other }) =>
      pipe([() => ({ Name: WorkGroup, ...other })])(),

    method: "createWorkGroup",
    //pickCreated: ({ payload }) => pipe([get("WorkGroup")]),
    pickCreated: ({ payload }) => pipe([() => payload]),
    // pickCreated: ({ payload }) => pipe([identity]),

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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html#updateWorkGroup-property
  update: {
    method: "updateWorkGroup",
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([
        () => payload,
        ({ Configuration, ...other }) => ({
          ConfigurationUpdates: Configuration,
          ...other,
        }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html#deleteWorkGroup-property
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
    method: "deleteWorkGroup",
    pickId,
    // isInstanceDown: pipe([eq(get("status"), "INACTIVE")]),
    // ignoreErrorCodes: ["ClusterNotFoundException"],
    // ignoreErrorMessages: [
    //   "The specified cluster is inactive. Specify an active cluster and try again.",
    // ],
    ignoreErrorMessages,
    // shouldRetryOnExceptionCodes: [],
    // shouldRetryOnExceptionMessages: [],
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html
exports.AthenaWorkGroup = ({ compare }) => ({
  type: "WorkGroup",
  propertiesDefault: {},
  omitProperties: ["CreationTime"],
  inferName: get("properties.WorkGroup"),
  cannotBeDeleted,
  managedByOther: cannotBeDeleted,
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

  // compare: compare({
  //   filterTarget: () => pipe([omit(["compare"])]),
  // }),
  dependencies: {
    s3BucketOutput: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([get("Configuration.ResultConfiguration.OutputLocation")]),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      dependencyId: ({ lives, config }) =>
        get("Configuration.ResultConfiguration.EncryptionConfiguration.KmsKey"),
    },
  },
  Client: ({ spec, config }) =>
    createAwsResource({
      model: model({ config }),
      spec,
      config,
      findName: pipe([
        get("live"),
        get("WorkGroup"),
        tap((name) => {
          assert(name);
        }),
      ]),
      // Find name from dependencies
      // findName: ({ live, lives }) =>
      //   pipe([
      //     () => live,
      //     fork({
      //       vpc: pipe([
      //         get("VPC.VPCId"),
      //         tap((id) => {
      //           assert(id);
      //         }),
      //         (id) =>
      //           lives.getById({
      //             id,
      //             type: "Vpc",
      //             group: "EC2",
      //           }),
      //         get("name"),
      //       ]),
      //       hostedZone: pipe([
      //         get("HostedZoneId"),
      //         tap((id) => {
      //           assert(id);
      //         }),
      //         (id) =>
      //           pipe([
      //             () =>
      //               lives.getById({
      //                 id,
      //                 type: "HostedZone",
      //                 group: "Route53",
      //                 providerName: config.providerName,
      //               }),
      //             get("name", id),
      //           ])(),
      //       ]),
      //     }),
      //     tap(({ vpc, hostedZone }) => {
      //       assert(vpc);
      //       assert(hostedZone);
      //     }),
      //     ({ vpc, hostedZone }) => `zone-assoc::${hostedZone}::${vpc}`,
      //   ])(),
      findId: pipe([
        get("live"),
        get("WorkGroup"),
        tap((id) => {
          assert(id);
        }),
      ]),
      // findId: pipe([
      //   get("live"),
      //   ({ resourceShareArn, associatedEntity }) =>
      //     `${resourceShareArn}::${associatedEntity}`,
      // ]),
      //getByName: getByNameCore,
      getByName: ({ getById }) =>
        pipe([({ name }) => ({ WorkGroup: name }), getById({})]),

      // getByName: ({ getList, endpoint }) =>
      //   pipe([
      //     tap((params) => {
      //       assert(true);
      //     }),
      //     ({ name }) => ({ Filters: [{ Name: "Name", Values: [name] }] }),
      //     endpoint().listWorkGroups,
      //     get("WorkGroups"),
      //     first,
      //     unless(isEmpty, decorate({ endpoint })),
      //   ]),

      //  getList for child resource

      // getList: ({ client, endpoint, getById, config }) =>
      //   pipe([
      //     () =>
      //       client.getListWithParent({
      //         parent: { type: "LogGroup", group: "CloudWatchLogs" },
      //         pickKey: pipe([pick(["logGroupName"])]),
      //         method: "describeSubscriptionFilters",
      //         getParam: "subscriptionFilters",
      //         config,
      //         decorate: () =>
      //           pipe([
      //             tap((params) => {
      //               assert(true);
      //             }),
      //           ]),
      //       }),
      //   ])(),

      // Custom getList

      // getList: ({ endpoint }) =>
      //   pipe([
      //     () => ["BILLING", "OPERATIONS", "SECURITY"],
      //     map(
      //       tryCatch(
      //         pipe([
      //           (AlternateContactType) => ({
      //             AlternateContactType,
      //           }),
      //           endpoint().getAlternateContact,
      //           get("AlternateContact"),
      //         ]),
      //         // TODO throw if not  "ResourceNotFoundException" or "AccessDeniedException",
      //         (error) =>
      //           pipe([
      //             tap((params) => {
      //               assert(error);
      //             }),
      //             () => undefined,
      //           ])()
      //       )
      //     ),
      //     filter(not(isEmpty)),
      //   ]),

      // Custom create
      // create:
      //   ({ endpoint, getById }) =>
      //   ({ payload, resolvedDependencies }) =>
      //     pipe([
      //       () => payload,
      //       switchCase([
      //         get("Certificate"),
      //         importCertificate({ endpoint }),
      //         requestCertificate({ endpoint, getById }),
      //       ]),
      //     ])(),

      // Custom update
      // update:
      //   ({ endpoint, getById }) =>
      //   async ({ payload, live, diff }) =>
      //     pipe([
      //       () => diff,
      //       tap.if(
      //         or([get("liveDiff.deleted.resourceTypes")]),
      //         pipe([
      //           () => payload.resourceTypes,
      //           differenceWith(isDeepEqual, resourceTypesAll),
      //           (resourceTypes) => ({
      //             accountIds: payload.accountIds,
      //             resourceTypes,
      //           }),
      //           endpoint().disable,
      //         ])
      //       ),
      //       tap.if(
      //         or([get("liveDiff.added.resourceTypes")]),
      //         pipe([() => payload, endpoint().enable])
      //       ),
      //     ])(),

      // filterLive: ({ lives, providerConfig }) =>
      //   pipe([
      //     assign({
      //       apiStages: pipe([
      //         get("apiStages"),
      //         map(
      //           assign({
      //             apiId: pipe([
      //               get("apiId"),
      //               replaceWithName({
      //                 groupType: "APIGateway::RestApi",
      //                 path: "id",
      //                 pathLive: "live.id",
      //                 providerConfig,
      //                 lives,
      //               }),
      //             ]),
      //           })
      //         ),
      //       ]),
      //     }),
      //   ]),
      ...Tagger({ buildArn: buildArn(config) }),
      configDefault: ({
        name,
        namespace,
        properties: { Tags, ...otherProps },
        dependencies: { kmsKey },
      }) =>
        pipe([
          () => otherProps,
          defaultsDeep({
            Tags: buildTags({ name, config, namespace, UserTags: Tags }),
          }),
          when(
            () => kmsKey,
            defaultsDeep({
              Configuration: {
                ResultConfiguration: {
                  EncryptionConfiguration: {
                    KmsKey: getField(kmsKey, "Arn"),
                  },
                },
              },
            })
          ),
        ])(),
    }),
});
