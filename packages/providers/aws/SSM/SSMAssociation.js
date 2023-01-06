const assert = require("assert");
const { pipe, tap, get, pick, assign, map, or } = require("rubico");
const { defaultsDeep, when, pluck, callProp } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./SSMCommon");

const buildArn = () => get("AssociationId");

const cannotBeDeleted = () =>
  pipe([
    get("Name"),
    or([callProp("startsWith", "Amazon"), callProp("startsWith", "AWS")]),
  ]);

const pickId = pipe([
  pick(["AssociationId"]),
  tap(({ AssociationId }) => {
    assert(AssociationId);
  }),
]);

const decorate = ({ endpoint }) =>
  pipe([
    assign({
      Tags: pipe([
        ({ AssociationId }) => ({
          ResourceId: AssociationId,
          ResourceType: "Association",
        }),
        endpoint().listTagsForResource,
        get("TagList"),
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html
exports.SSMAssociation = () => ({
  type: "Association",
  package: "ssm",
  client: "SSM",
  cannotBeDeleted,
  managedByOther: cannotBeDeleted,
  findName: () => get("AssociationName"),
  findId: () =>
    pipe([
      get("AssociationId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  inferName: () => get("AssociationName"),
  propertiesDefault: { RegistrationLimit: 1 },
  omitProperties: [
    "AssociationId",
    "LastExecutionDate",
    "Overview",
    "LastSuccessfulExecutionDate",
    "LastUpdateAssociationDate",
    "Date",
    "AssociationVersion",
    "DocumentVersion",
  ],
  ignoreErrorCodes: ["AssociationDoesNotExist"],
  dependencies: {
    alarms: {
      type: "MetricAlarm",
      group: "CloudWatch",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("AlarmConfiguration.Alarms"),
          pluck("Name"),
          map(
            lives.getByName({
              type: "MetricAlarm",
              group: "CloudWatch",
              providerName: config.providerName,
            })
          ),
        ]),
    },
    document: {
      type: "Document",
      group: "SSM",
      dependencyId: () => get("Name"),
    },
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        get("OutputLocation.S3Location.OutputS3BucketName"),
    },
  },
  getById: {
    pickId,
    method: "describeAssociation",
    getField: "AssociationDescription",
    decorate,
  },
  getList: {
    method: "listAssociations",
    getParam: "Associations",
    decorate: ({ getById }) => pipe([getById]),
  },
  create: {
    method: "createAssociation",
    pickCreated: ({ payload }) => get("AssociationDescription"),
  },
  destroy: { method: "deleteAssociation", pickId },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn(config),
      additionalParams: pipe([() => ({ ResourceType: "Association" })]),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { document },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(() => document, assign({ Name: () => getField(document, "Arn") })),
    ])(),
});
