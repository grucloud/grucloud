const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, append } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags, ignoreErrorCodes } = require("./SageMakerCommon");

const buildArn = () =>
  pipe([
    get("UserProfileArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ UserProfileName, DomainId }) => {
    assert(UserProfileName);
    assert(DomainId);
  }),
  pick(["DomainId", "UserProfileName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html
exports.SageMakerUserProfile = () => ({
  type: "UserProfile",
  package: "sagemaker",
  client: "SageMaker",
  propertiesDefault: {},
  omitProperties: [
    "UserProfileArn",
    "HomeEfsFileSystemUid",
    "Status",
    "LastModifiedTime",
    "CreationTime",
    "FailureReason",
    "UserSettings.ExecutionRole",
  ],
  inferName:
    ({ dependenciesSpec: { domain } }) =>
    ({ UserProfileName }) =>
      pipe([
        tap((params) => {
          assert(domain);
          assert(UserProfileName);
        }),
        () => `${domain}::${UserProfileName}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ UserProfileName, DomainId }) =>
      pipe([
        tap((params) => {
          assert(DomainId);
          assert(UserProfileName);
        }),
        () => DomainId,
        lives.getById({
          type: "Domain",
          group: "SageMaker",
          providerName: config.providerName,
        }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
        append(`::${UserProfileName}`),
      ])(),
  findId: () =>
    pipe([
      get("UserProfileName"),
      tap((UserProfileName) => {
        assert(UserProfileName);
      }),
    ]),
  ignoreErrorCodes,
  dependencies: {
    domain: {
      type: "Domain",
      group: "SageMaker",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("DomainId"),
          tap((DomainId) => {
            assert(DomainId);
          }),
        ]),
    },
    executionRoleUser: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => get("UserSettings.ExecutionRole"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#describeUserProfile-property
  getById: {
    method: "describeUserProfile",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#listUserProfiles-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Domain", group: "SageMaker" },
          pickKey: pipe([
            pick(["DomainId"]),
            tap(({ DomainId }) => {
              assert(DomainId);
            }),
          ]),
          method: "listUserProfiles",
          getParam: "UserProfiles",
          config,
          decorate: () => pipe([getById({})]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#createUserProfile-property
  create: {
    method: "createUserProfile",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#updateUserProfile-property
  update: {
    method: "updateUserProfile",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#deleteUserProfile-property
  destroy: {
    method: "deleteUserProfile",
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
    dependencies: { domain, executionRoleUser },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(domain);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        DomainId: getField(domain, "DomainId"),
      }),
      when(
        () => executionRoleSpace,
        defaultsDeep({
          UserSettings: {
            ExecutionRole: getField(executionRoleUser, "Arn"),
          },
        })
      ),
    ])(),
});
