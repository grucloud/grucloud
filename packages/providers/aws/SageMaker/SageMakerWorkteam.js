const assert = require("assert");
const { pipe, tap, get, pick, map, assign } = require("rubico");
const { defaultsDeep, when, pluck } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");
const { replaceWithName } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./SageMakerCommon");

const buildArn = () =>
  pipe([
    get("WorkteamArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ WorkteamName }) => {
    assert(WorkteamName);
  }),
  pick(["WorkteamName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html
exports.SageMakerWorkteam = () => ({
  type: "Workteam",
  package: "sagemaker",
  client: "SageMaker",
  propertiesDefault: {},
  omitProperties: [
    "WorkteamArn",
    "WorkforceArn",
    "ProductListingIds",
    "CreationTime",
    "LastUpdatedDate",
    "NotificationConfiguration",
    "SubDomain",
    "WorkforceName",
  ],
  inferName: () =>
    pipe([
      get("WorkteamName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("WorkteamName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("WorkteamArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ValidationException"],
  dependencies: {
    cognitoUserPoolClients: {
      type: "UserPoolClient",
      group: "CognitoIdentityServiceProvider",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("MemberDefinitions"),
          pluck("CognitoMemberDefinition.ClientId"),
        ]),
    },
    cognitoUserGroups: {
      type: "Group",
      group: "CognitoIdentityServiceProvider",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("MemberDefinitions"),
          pluck("CognitoMemberDefinition.UserGroup"),
        ]),
    },
    cognitoUserPoolDomains: {
      type: "UserPoolDomain",
      group: "CognitoIdentityServiceProvider",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("MemberDefinitions"),
          pluck("CognitoMemberDefinition.UserPool"),
        ]),
    },
    snsTopic: {
      type: "Topic",
      group: "SNS",
      dependencyId: ({ lives, config }) =>
        pipe([get("NotificationConfiguration.NotificationTopicArn")]),
    },
    workforce: {
      type: "Workforce",
      group: "SageMaker",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("WorkforceName"),
          tap((WorkforceName) => {
            assert(WorkforceName);
          }),
        ]),
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        MemberDefinitions: pipe([
          get("MemberDefinitions"),
          map(
            assign({
              CognitoMemberDefinition: pipe([
                get("CognitoMemberDefinition"),
                assign({
                  ClientId: pipe([
                    get("ClientId"),
                    replaceWithName({
                      groupType:
                        "CognitoIdentityServiceProvider::UserPoolClient",
                      path: "id",
                      providerConfig,
                      lives,
                    }),
                  ]),
                  UserPool: pipe([
                    get("UserPool"),
                    replaceWithName({
                      groupType:
                        "CognitoIdentityServiceProvider::UserPoolDomain",
                      path: "id",
                      providerConfig,
                      lives,
                    }),
                  ]),
                }),
              ]),
            })
          ),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#describeWorkteam-property
  getById: {
    method: "describeWorkteam",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#listWorkteams-property
  getList: {
    method: "listWorkteams",
    getParam: "Workteams",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#createWorkteam-property
  create: {
    method: "createWorkteam",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#updateWorkteam-property
  update: {
    method: "updateWorkteam",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#deleteWorkteam-property
  destroy: {
    method: "deleteWorkteam",
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
    dependencies: { snsTopic, workforce },
    config,
  }) =>
    pipe([
      tap((id) => {
        assert(workforce);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        WorkforceName: getField(workforce, "WorkforceName"),
      }),
      when(
        () => snsTopic,
        defaultsDeep({
          NotificationConfiguration: {
            NotificationTopicArn: getField(snsTopic, "Attributes.TopicArn"),
          },
        })
      ),
    ])(),
});
