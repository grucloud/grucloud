const assert = require("assert");
const { pipe, assign, tap, get, pick, omit, switchCase } = require("rubico");
const { defaultsDeep, when, isEmpty, unless, first } = require("rubico/x");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./CloudTrailCommon");
const { getField } = require("../../../core/ProviderCommon");

const SELECTORS = ["EventSelectors", "AdvancedEventSelectors"];

const model = {
  package: "cloudtrail",
  client: "CloudTrail",
  ignoreErrorCodes: ["TrailNotFoundException"],
  getById: { method: "getTrail", getField: "Trail" },
  getList: { method: "listTrails", getParam: "Trails" },
  create: { method: "createTrail" },
  update: { method: "update" },
  destroy: { method: "deleteTrail" },
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudTrail.html
exports.CloudTrail = ({ spec, config }) =>
  createAwsResource({
    model,
    spec,
    config,
    findName: get("live.Name"),
    findId: pipe([get("live.TrailARN")]),
    pickId: pipe([pick(["Name"])]),
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
    decorateList: ({ endpoint, getById }) => pipe([getById]),
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
    createFilterPayload: pipe([omit(SELECTORS)]),
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
        unless(isEmpty, endpoint().putEventSelectors),
      ]),
    getByName: ({ getById }) => pipe([({ name }) => ({ Name: name }), getById]),
    tagResource: tagResource,
    untagResource: untagResource,
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
