const assert = require("assert");
const {
  pipe,
  tap,
  get,
  assign,
  tryCatch,
  switchCase,
  pick,
  map,
  omit,
} = require("rubico");
const { defaultsDeep, when, size, pluck } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

const { buildTags, isAwsError, findNameInTagsOrId } = require("../AwsCommon");
const { tagResource, untagResource } = require("./SecretsManagerCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const ignoreErrorMessages = [
  "You can't perform this operation on the secret because it was marked for deletion",
];

const pickId = pipe([({ Name }) => ({ SecretId: Name })]);

const managedByOther = () => pipe([get("OwningService")]);

const getSecretValue = ({ endpoint }) =>
  tryCatch(
    pipe([
      tap(({ Name }) => {
        assert(Name);
        assert(endpoint);
      }),
      ({ Name }) => ({ SecretId: Name }),
      endpoint().getSecretValue,
      pick(["SecretString", "SecretBinary"]),
      when(
        get("SecretString"),
        assign({
          SecretString: tryCatch(
            pipe([get("SecretString"), JSON.parse]),
            (error, input) => input
          ),
        })
      ),
    ]),
    (error) => pipe([() => ({})])()
  );

const decorate =
  ({ endpoint }) =>
  (live) =>
    pipe([
      tap((params) => {
        assert(endpoint);
      }),
      () => live,
      getSecretValue({ endpoint }),
      defaultsDeep(live),
      tap((params) => {
        assert(true);
      }),
      ({ Name, ReplicationStatus, ...other }) => ({
        Name,
        AddReplicaRegions: ReplicationStatus,
        ...other,
      }),
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecretsManager.html
exports.SecretsManagerSecret = ({ compare }) => ({
  type: "Secret",
  package: "secrets-manager",
  client: "SecretsManager",
  inferName: get("properties.Name"),
  findName: findNameInTagsOrId({ findId: () => get("Name") }),
  findId: () => pipe([get("ARN")]),
  managedByOther,
  ignoreErrorCodes: ["ResourceNotFoundException", "InvalidRequestException"],
  dependencies: {
    kmsKey: {
      type: "Key",
      group: "KMS",
      dependencyId: ({ lives, config }) => get("KmsKeyId"),
    },
    kmsKeyReplicaRegions: {
      type: "Key",
      group: "KMS",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("AddReplicaRegions"), pluck("KmsKeyId")]),
    },
  },
  omitProperties: [
    "ARN",
    "CreatedDate",
    "LastAccessedDate",
    "LastChangedDate",
    "LastRotatedDate",
    "DeletedDate",
    "SecretVersionsToStages",
    "SecretString.DBClusterIdentifier",
    "SecretString.host",
    "RotationEnabled",
    "RotationLambdaARN",
    "RotationRules",
    "VersionIdsToStages",
  ],
  compare: compare({
    filterAll: () =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        omit(["SecretString", "SecretBinary"]),
      ]),
  }),
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      when(
        get("AddReplicaRegions"),
        assign({
          AddReplicaRegions: pipe([
            get("AddReplicaRegions"),
            map(
              pipe([
                pick(["KmsKeyId", "Region"]),
                assign({
                  KmsKeyId: pipe([
                    get("KmsKeyId"),
                    replaceWithName({
                      groupType: "KMS::Key",
                      path: "id",
                      providerConfig,
                      lives,
                    }),
                  ]),
                }),
              ])
            ),
          ]),
        })
      ),
      assign({
        SecretString: pipe([
          get("SecretString"),
          when(
            get("password"),
            assign({
              password: pipe([
                get("password"),
                (password) => () =>
                  `generatePassword({length:${size(password)}})`,
              ]),
            })
          ),
        ]),
      }),
    ]),
  getById: {
    method: "describeSecret",
    pickId,
    ignoreErrorMessages,
    decorate,
  },
  getList: {
    method: "listSecrets",
    getParam: "SecretList",
    decorate: ({ getById }) => getById,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecretsManager.html#createSecret-property
  create:
    ({ endpoint, getById }) =>
    ({ payload }) =>
      tryCatch(
        pipe([
          () => payload,
          when(
            get("SecretString"),
            assign({
              SecretString: pipe([get("SecretString"), JSON.stringify]),
            })
          ),
          endpoint().createSecret,
        ]),
        switchCase([
          isAwsError("InvalidRequestException"),
          pipe([
            () => ({ SecretId: payload.Name }),
            endpoint().restoreSecret,
            ({ Name }) => ({
              SecretId: Name,
            }),
            defaultsDeep(
              pipe([
                () => payload,
                pick(["SecretString", "SecretBinary"]),
                assign({
                  SecretString: pipe([get("SecretString"), JSON.stringify]),
                }),
              ])()
            ),
            endpoint().putSecretValue,
          ]),
          (error) => {
            throw error;
          },
        ])
      )(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecretsManager.html#putSecretValue-property
  update: {
    method: "putSecretValue",
    filterParams: ({ payload }) => pipe([() => payload]),
  },
  destroy: {
    method: "deleteSecret",
    pickId,
    ignoreErrorMessages,
    isInstanceDown: pipe([() => true]),
  },
  getByName: getByNameCore,
  tagResource: tagResource,
  untagResource: untagResource,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { kmsKey },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Name: name,
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(() => kmsKey, defaultsDeep({ KmsKeyId: getField(kmsKey, "Arn") })),
    ])(),
});
