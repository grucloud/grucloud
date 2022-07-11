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
} = require("rubico");
const { defaultsDeep, when, isEmpty, unless, first } = require("rubico/x");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./CloudTrailCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const SELECTORS = ["EventSelectors", "AdvancedEventSelectors"];

const pickId = pipe([pick(["Name"])]);

const createModel = () => ({
  package: "cloudtrail",
  client: "CloudTrail",
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
    decorate: ({ endpoint, getById }) => pipe([getById]),
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
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudTrail.html
exports.CloudTrail = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: get("live.Name"),
    findId: pipe([get("live.TrailARN")]),
    findDependencies: ({ live, lives }) => [
      { type: "Bucket", group: "S3", ids: [live.S3BucketName] },
      {
        type: "LogsGroup",
        group: "CloudWatchLogs",
        ids: [live.CloudWatchLogsLogGroupArn],
      },
      { type: "role", group: "IAM", ids: [live.CloudWatchLogsRoleArn] },
      { type: "Key", group: "KMS", ids: [live.KmsKeyId] },
      { type: "Topic", group: "SNS", ids: [live.SnsTopicARN] },
    ],
    getByName: ({ getById }) => pipe([({ name }) => ({ Name: name }), getById]),
    tagResource: tagResource,
    untagResource: untagResource,
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
          defaultsDeep({ SnsTopicARN: getField(snsTopic, "TopicArn") })
        ),
        when(
          () => kmsKey,
          defaultsDeep({ KmsKeyId: getField(kmsKey, "TopicArn") })
        ),
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
