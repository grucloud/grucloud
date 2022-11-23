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
  fork,
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
const { buildTags } = require("../AwsCommon");
const { buildTagsObject } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

// const {
//   Tagger,
//   //assignTags,
// } = require("./MyModuleCommon");

//////////////
// buildArn
//////////////
const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

// const buildArn =
// ({ config }) =>
// ({ ConfigurationSetName }) =>
//   `arn:aws:ses:${
//     config.region
//   }:${config.accountId()}:/configurationset/${ConfigurationSetName}`;

//////////
// pickId
//////////

// const pickId = pipe([
//   tap(({ name }) => {
//     assert(name);
//   }),
//   ({ name }) => ({ loadBalancerName: name }),
// ]);

const pickId = pipe([
  tap(({ MyId }) => {
    assert(MyId);
  }),
  pick(["MyId"]),
]);

//////////
// decorate
//////////

// const assignArn = ({ config }) =>
//   pipe([
//     assign({
//       Arn: pipe([
//         ({ IdentityPoolId }) =>
//           `arn:aws:cognito-identity:${
//             config.region
//           }:${config.accountId()}:identitypool/${IdentityPoolId}`,
//       ]),
//     }),
//   ]);

// const liveToTags = ({ IdentityPoolTags, ...other }) => ({
//   ...other,
//   Tags: IdentityPoolTags,
// });

// const tagsToPayload = ({ Tags, ...other }) => ({
//   ...other,
//   IdentityPoolTags: Tags,
// });

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    //({ name, ...other }) => ({ loadBalancerName: name, ...other }),
    //assign({ MyJSON: pipe([get("MyJSON"), JSON.parse]) }),
    //assignTags({ endpoint }),
    //liveToTags
    //assignArn({ config }),
  ]);
////////////////////
// managedByOther
////////////////////

// const managedByOther = () => pipe([eq(get("Type"), "managed")]);

// const managedByOther = () => pipe([
//   get("CacheParameterGroupName"),
//   callProp("startsWith", "default."),
// ]);

// const managedByOther = ({  lives }) =>
//   live => pipe([
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

//  const cannotBeDeleted = () => pipe([ eq(get("status"), "INACTIVE")]);

// const cannotBeDeleted = ()=> pipe([
//   get("autoEnable"),
//   (autoEnable) =>
//     isDeepEqual(autoEnable, {
//       ec2: false,
//       ecr: false,
//     }),
// ]);

// const cannotBeDeleted = ()=> pipe([
//   get("Path"),
//   or([includes("/aws-service-role"), includes("/aws-reserved/")]),
// ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html
exports.MyModuleMyResource = () => ({
  type: "MyResource",
  package: "myModule",
  client: "MyModule",
  propertiesDefault: {},
  omitProperties: [],
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),

  // inferName: ({
  //   dependenciesSpec: { loadBalancer },
  // }) =>
  //  ({ certificateName }) => pipe([
  //     tap((params) => {
  //       assert(loadBalancer);
  //       assert(certificateName);
  //     }),
  //     () => `${loadBalancer}::${certificateName}`,
  //   ])(),

  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  // Find name from dependencies
  // findName: ({  lives, config }) =>
  //   live => pipe([
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
  findId: () =>
    pipe([
      get("Arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  // findId:()=> pipe([
  //   ({ resourceShareArn, associatedEntity }) =>
  //     `${resourceShareArn}::${associatedEntity}`,
  // ]),
  // environmentVariables: [
  //   { path: "masterUsername", suffix: "MASTER_USERNAME" },
  //   { path: "masterUserPassword", suffix: "MASTER_USER_PASSWORD" },
  // ],

  // compare: compare({
  //   filterTarget: () => pipe([omit(["compare"])]),
  // }),
  // dependencies: {
  //   alarmRoles: {
  //     type: "Role",
  //     group: "IAM",
  //     list: true,
  //     dependencyIds: ({ lives, config }) =>
  //       pipe([get("Monitors"), pluck("AlarmRoleArn")]),
  //   },
  //   kmsKey: {
  //     type: "Key",
  //     group: "KMS",
  //     excludeDefaultDependencies: true,
  //     dependencyId: ({ lives, config }) => get("Attributes.KmsMasterKeyId"),
  //   },
  //   subnets: {
  //     type: "Subnet",
  //     group: "EC2",
  //     list: true,
  //     dependencyIds: ({ lives, config }) => get("VpcSubnetIds"),
  //   },
  //   table: {
  //     type: "Table",
  //     group: "DynamoDB",
  //     parent: true,
  //     dependencyId: ({ lives, config }) =>
  //       pipe([
  //         (live) =>
  //           lives.getByName({
  //             name: live.TableName,
  //             type: "Table",
  //             group: "DynamoDB",
  //             providerName: config.providerName,
  //           }),
  //         get("id"),
  //         tap((id) => {
  //           assert(id);
  //         }),
  //       ]),
  //   },
  //   stage: {
  //     type: "Stage",
  //     group: "ApiGatewayV2",
  //     parent: true,
  //     dependencyId:
  //       ({ lives, config }) =>
  //       (live) =>
  //         pipe([
  //           () =>
  //             lives.getByType({
  //               providerName: config.providerName,
  //               type: "Stage",
  //               group: "ApiGatewayV2",
  //             }),
  //           find(
  //             and([
  //               eq(get("live.StageName"), live.Stage),
  //               eq(get("live.ApiId"), live.ApiId),
  //             ])
  //           ),
  //           get("id"),
  //         ])(),
  //   },
  // },

  ignoreErrorCodes: ["ResourceNotFoundException"],

  //managedByOther,
  //cannotBeDeleted
  // ignoreErrorMessages: [
  //   "The specified cluster is inactive. Specify an active cluster and try again.",
  // ],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html#getMyResource-property
  getById: {
    method: "getMyResource",
    getField: "MyResource",
    pickId,
    // pickId: ({ AlarmName }) => ({
    //   AlarmNames: [AlarmName],
    //   AlarmTypes: ["MetricAlarm"],
    // }),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html#listMyResources-property
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

    method: "listMyResources",
    getParam: "MyResources",
    decorate: ({ getById }) => pipe([getById]),
    //decorate,
    //decorate: ({ getById }) => pipe([(name) => ({ name }), getById]),
  },
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html#createMyResource-property
  create: {
    // filterPayload: ({ Tags, ...other }) =>
    //   pipe([() => ({ ...other, BackupVaultTags: Tags })])(),
    // filterPayload: pipe([tagsToPayload]),
    //filterPayload: pipe([omit(SELECTORS)]),

    method: "createMyResource",
    pickCreated: ({ payload }) => pipe([get("MyResource")]),
    // pickCreated: ({ payload }) => pipe([() => payload]),
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html#updateMyResource-property
  update: {
    method: "updateMyResource",
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
    // filterParams: ({ pickId, payload, diff, live }) =>
    //   pipe([
    //     () => payload,
    //     // assign({
    //     //   SecretId: () => live.ARN,
    //     // }),
    //   ])(),
  },
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html#deleteMyResource-property
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
    method: "deleteMyResource",
    pickId,
    // isInstanceDown: pipe([eq(get("status"), "INACTIVE")]),
    // ignoreErrorCodes: ["ClusterNotFoundException"],
    // ignoreErrorMessages: [
    //   "The specified cluster is inactive. Specify an active cluster and try again.",
    // ],
    // shouldRetryOnExceptionCodes: [],
    // shouldRetryOnExceptionMessages: [],
  },
  getByName: getByNameCore,
  // getByName: ({ getById }) =>
  //   pipe([({ name }) => ({ ConnectionName: name }), getById({})]),

  // getByName: ({ getList, endpoint }) =>
  //   pipe([
  //     tap((params) => {
  //       assert(true);
  //     }),
  //     ({ name }) => ({ Filters: [{ Name: "Name", Values: [name] }] }),
  //     endpoint().listMyResources,
  //     get("MyResources"),
  //     first,
  //     unless(isEmpty, decorate({ endpoint })),
  //   ]),

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
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
      //additionalParams: pipe([pick(["InstanceArn"])]),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        // cluster: getField(cluster, "clusterArn"),
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        // tags: buildTags({
        //   name,
        //   config,
        //   namespace,
        //   UserTags: tags,
        //   key: "key",
        //   value: "value",
        // }),
        //Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),

      // Optional dependency for IAM Role
      // when(
      //   () => iamRole,
      //   assign({ RetrievalRoleArn: getField(iamRole, "Arn") })
      // ),

      // Optional dependency for KMS Key

      // when(
      //   () => kmsKey,
      //   defaultsDeep({
      //     configuration: {
      //       executeCommandConfiguration: { kmsKeyId: getField(kmsKey, "Arn") },
      //     },
      //   })
      // ),

      // Optional dependency with array

      // when(
      //   () => securityGroups,
      //   defaultsDeep({
      //     SecurityGroupIds: pipe([
      //       () => securityGroups,
      //       map((sg) => getField(sg, "GroupId")),
      //     ])(),
      //   })
      // ),
    ])(),
});
