const assert = require("assert");
const { pipe, tap, get, assign } = require("rubico");
const { defaultsDeep, prepend } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./CognitoIdentityServiceProviderCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ Id }) => {
    assert(Id);
  }),
  ({ Id }) => ({ UserPoolId: Id }),
]);

const liveToTags = ({ UserPoolTags, ...other }) => ({
  ...other,
  Tags: UserPoolTags,
});

const tagsToPayload = ({ Tags, ...other }) => ({
  ...other,
  UserPoolTags: Tags,
});

const decorate = ({ endpoint, config }) =>
  pipe([
    assign({
      ProviderName: pipe([
        get("Id"),
        prepend(`cognito-idp.${config.region}.amazonaws.com/`),
      ]),
    }),
    ({ Name, ...other }) => ({
      PoolName: Name,
      ...other,
    }),
    liveToTags,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html
exports.CognitoIdentityServiceProviderUserPool = () => ({
  type: "UserPool",
  package: "cognito-identity-provider",
  client: "CognitoIdentityProvider",
  inferName: pipe([
    get("properties.PoolName"),
    tap((Name) => {
      assert(Name);
    }),
  ]),
  findName: () =>
    pipe([
      get("PoolName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("Id"),
      tap((id) => {
        assert(id);
      }),
    ]),
  omitProperties: [
    "Arn",
    "ProviderName",
    "CreationDate",
    "EstimatedNumberOfUsers",
    "LastModifiedDate",
    "Id",
    "AdminCreateUserConfig.UnusedAccountValidityDays",
    "Domain",
    "CustomDomain",
    "SchemaAttributes",
  ],
  propertiesDefault: {
    DeletionProtection: "INACTIVE",
    AccountRecoverySetting: {
      RecoveryMechanisms: [
        {
          Name: "verified_email",
          Priority: 1,
        },
        {
          Name: "verified_phone_number",
          Priority: 2,
        },
      ],
    },
    AdminCreateUserConfig: {
      AllowAdminCreateUserOnly: false,
      TemporaryPasswordValidityDays: 7,
    },
    AutoVerifiedAttributes: ["email"],
    EmailConfiguration: {
      EmailSendingAccount: "COGNITO_DEFAULT",
    },
    LambdaConfig: {},
    MfaConfiguration: "OFF",
    Policies: {
      PasswordPolicy: {
        MinimumLength: 8,
        RequireLowercase: true,
        RequireNumbers: true,
        RequireSymbols: true,
        RequireUppercase: true,
        TemporaryPasswordValidityDays: 7,
      },
    },
    UserAttributeUpdateSettings: {
      AttributesRequireVerificationBeforeUpdate: [],
    },
    UsernameConfiguration: {
      CaseSensitive: false,
    },
    VerificationMessageTemplate: {
      DefaultEmailOption: "CONFIRM_WITH_CODE",
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#describeUserPool-property
  getById: {
    method: "describeUserPool",
    getField: "UserPool",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#listUserPools-property
  getList: {
    enhanceParams: () => () => ({ MaxResults: 10 }),
    method: "listUserPools",
    getParam: "UserPools",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#createUserPool-property
  create: {
    filterPayload: pipe([tagsToPayload]),
    method: "createUserPool",
    pickCreated: ({ payload }) => pipe([get("UserPool")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#updateUserPool-property
  update: {
    method: "updateUserPool",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, tagsToPayload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#deleteUserPool-property
  destroy: {
    method: "deleteUserPool",
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
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({
          config,
          namespace,
          name,
          userTags: Tags,
        }),
      }),
    ])(),
});
