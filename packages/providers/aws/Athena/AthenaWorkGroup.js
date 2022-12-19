const assert = require("assert");
const { pipe, tap, get, pick, eq, assign } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { createAwsResource } = require("../AwsClient");

const { Tagger } = require("./AthenaCommon");

const ignoreErrorMessages = ["not found"];

const buildArn =
  ({ region, accountId }) =>
  ({ WorkGroup }) =>
    `arn:aws:athena:${region}:${accountId()}:workgroup/${WorkGroup}`;

const pickId = pipe([
  tap(({ WorkGroup }) => {
    assert(WorkGroup);
  }),
  pick(["WorkGroup"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    ({ Name }) => ({ WorkGroup: Name }),
  ]);

const cannotBeDeleted = () => pipe([eq(get("WorkGroup"), "primary")]);

const model = ({ config }) => ({
  package: "athena",
  client: "Athena",
  ignoreErrorCodes: ["ResourceNotFoundException"],
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
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html#updateWorkGroup-property
  update: {
    method: "updateWorkGroup",
    filterParams: ({ payload, diff, live }) =>
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
    method: "deleteWorkGroup",
    pickId,
    ignoreErrorMessages,
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html
exports.AthenaWorkGroup = ({ compare }) => ({
  type: "WorkGroup",
  propertiesDefault: {},
  omitProperties: ["CreationTime", "ResultConfiguration.ExecutionRole"],
  inferName: () => get("WorkGroup"),
  cannotBeDeleted,
  managedByOther: cannotBeDeleted,
  dependencies: {
    iamRoleExecution: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        pipe([get("ResultConfiguration.ExecutionRole")]),
    },
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
    // TODO kmsKey customer
  },
  Client: ({ spec, config }) =>
    createAwsResource({
      model: model({ config }),
      spec,
      config,
      findName: () =>
        pipe([
          get("WorkGroup"),
          tap((name) => {
            assert(name);
          }),
        ]),
      findId: () =>
        pipe([
          get("WorkGroup"),
          tap((id) => {
            assert(id);
          }),
        ]),
      getByName: ({ getById }) =>
        pipe([({ name }) => ({ WorkGroup: name }), getById({})]),
      ...Tagger({ buildArn: buildArn(config) }),
      configDefault: ({
        name,
        namespace,
        properties: { Tags, ...otherProps },
        dependencies: { kmsKey, iamRoleExecution },
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
          when(
            () => iamRoleExecution,
            assign({
              ResultConfiguration: {
                ExecutionRole: getField(iamRoleExecution, "Arn"),
              },
            })
          ),
        ])(),
    }),
});
