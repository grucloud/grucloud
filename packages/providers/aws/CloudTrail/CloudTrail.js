const assert = require("assert");
const {
  pipe,
  assign,
  tap,
  get,
  pick,
  omit,
  switchCase,
  not,
  and,
  lte,
} = require("rubico");
const {
  defaultsDeep,
  when,
  isEmpty,
  unless,
  first,
  size,
} = require("rubico/x");

const { buildTags, replaceRegionAll } = require("../AwsCommon");
const { Tagger } = require("./CloudTrailCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const SELECTORS = ["EventSelectors", "AdvancedEventSelectors"];

const buildArn = () =>
  pipe([
    get("TrailARN"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([pick(["Name"])]);

const filterEventSelector = pipe([
  when(
    and([
      pipe([get("EventSelectors"), lte(size, 1)]),
      pipe([get("EventSelectors"), first, get("DataResources"), isEmpty]),
    ]),
    omit(["EventSelectors"])
  ),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudTrail.html
exports.CloudTrail = ({ compare }) => ({
  type: "Trail",
  package: "cloudtrail",
  client: "CloudTrail",
  inferName: () => pipe([get("Name")]),
  findName: () => get("Name"),
  findId: () => pipe([get("TrailARN")]),
  omitProperties: [
    "S3BucketName",
    "SnsTopicARN",
    "TrailARN",
    "CloudWatchLogsLogGroupArn",
    "CloudWatchLogsRoleArn",
    "KmsKeyId",
    "HasCustomEventSelectors",
    "LogFileValidationEnabled",
    "HasInsightSelectors",
  ],
  compare: compare({
    filterLive: () => pipe([filterEventSelector]),
  }),
  filterLive: ({ providerConfig }) =>
    pipe([
      filterEventSelector,
      assign({
        HomeRegion: pipe([
          get("HomeRegion"),
          replaceRegionAll({ providerConfig }),
        ]),
      }),
    ]),
  dependencies: {
    bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) => get("S3BucketName"),
    },
    logGroup: {
      type: "LogsGroup",
      group: "CloudWatchLogs",
      dependencyId: ({ lives, config }) => get("CloudWatchLogsLogGroupArn"),
    },
    logGroupRole: {
      type: "role",
      group: "IAM",
      dependencyId: ({ lives, config }) => get("CloudWatchLogsRoleArn"),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      dependencyId: ({ lives, config }) => get("KmsKeyId"),
    },
    snsTopic: {
      type: "Topic",
      group: "SNS",
      dependencyId: ({ lives, config }) => get("SnsTopicARN"),
    },
  },
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ Name: name }), getById({})]),
  ignoreErrorCodes: ["TrailNotFoundException", "ResourceNotFoundException"],
  getById: {
    pickId,
    method: "getTrail",
    getField: "Trail",
    decorate:
      ({ endpoint }) =>
      (live) =>
        pipe([
          () => ({ TrailName: live.Name }),
          endpoint().getEventSelectors,
          pick(SELECTORS),
          defaultsDeep(live),
          assign({
            TagsList: pipe([
              () => ({ ResourceIdList: [live.TrailARN] }),
              endpoint().listTags,
              get("ResourceTagList"),
              first,
              get("TagsList"),
            ]),
          }),
        ])(),
  },
  getList: {
    method: "listTrails",
    getParam: "Trails",
    decorate: ({ getById }) => pipe([getById]),
  },
  create: {
    method: "createTrail",
    filterPayload: pipe([omit(SELECTORS)]),
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    postCreate: ({ endpoint, payload }) =>
      pipe([
        () => payload,
        switchCase([
          get("EventSelectors"),
          () => ({
            EventSelectors: payload.EventSelectors,
          }),
          get("AdvancedEventSelectors"),
          () => ({
            AdvancedEventSelectors: payload.AdvancedEventSelectors,
          }),
          () => undefined,
        ]),
        unless(
          isEmpty,
          pipe([
            defaultsDeep({ TrailName: payload.Name }),
            endpoint().putEventSelectors,
          ])
        ),
      ]),
  },
  destroy: { method: "deleteTrail", pickId },
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  update:
    ({ endpoint }) =>
    async ({ pickId, payload, diff, live }) =>
      pipe([
        tap((params) => {
          assert(endpoint);
        }),
        () => diff,
        tap.if(
          get("liveDiff.updated.EventSelectors"),
          pipe([
            () => payload,
            pick(["EventSelectors"]),
            defaultsDeep({ TrailName: payload.Name }),
            endpoint().putEventSelectors,
          ])
        ),
        tap.if(
          get("liveDiff.updated.AdvancedEventSelectors"),
          pipe([
            () => payload,
            pick(["AdvancedEventSelectors"]),
            defaultsDeep({ TrailName: payload.Name }),
            endpoint().putEventSelectors,
          ])
        ),
        omit([
          "liveDiff.updated.AdvancedEventSelectors",
          "liveDiff.updated.EventSelectors",
        ]),
        tap.if(
          not(pipe([get("liveDiff.updated"), isEmpty])),
          pipe([
            tap((params) => {
              assert(true);
            }),
            () => payload,
            omit(["AdvancedEventSelectors", "EventSelectors", "TagsList"]),
            endpoint().updateTrail,
            tap((params) => {
              assert(true);
            }),
          ])
        ),
      ])(),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { bucket, kmsKey, snsTopic, logGroup, logGroupRole },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(bucket);
        assert(name);
      }),
      () => otherProps,
      defaultsDeep({
        Name: name,
        S3BucketName: getField(bucket, "Name"),
        TagsList: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => snsTopic,
        defaultsDeep({
          SnsTopicARN: getField(snsTopic, "Attributes.TopicArn"),
        })
      ),
      when(() => kmsKey, defaultsDeep({ KmsKeyId: getField(kmsKey, "Arn") })),
      when(
        () => logGroup,
        defaultsDeep({
          CloudWatchLogsLogGroupArn: getField(logGroup, "arn"),
        })
      ),
      when(
        () => logGroupRole,
        defaultsDeep({
          CloudWatchLogsRoleArn: getField(logGroupRole, "arn"),
        })
      ),
    ])(),
});
