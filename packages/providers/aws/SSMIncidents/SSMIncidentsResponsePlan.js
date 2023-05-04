const assert = require("assert");
const { pipe, tap, get, pick, assign, map } = require("rubico");
const { defaultsDeep, pluck, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./SSMIncidentsCommon");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ arn }) => {
    assert(arn);
  }),
  pick(["arn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn({ config }), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSMIncidents.html
exports.SSMIncidentsResponsePlan = () => ({
  type: "ResponsePlan",
  package: "ssm-incidents",
  client: "SSMIncidents",
  propertiesDefault: {},
  omitProperties: ["arn"],
  inferName: () =>
    pipe([
      get("name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: [
    "ResourceNotFoundException",
    "ValidationException",
    "AccessDeniedException",
  ],
  dependencies: {
    ssmContacts: {
      type: "Contact",
      group: "SSM",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("engagements")]),
    },
    iamRoles: {
      type: "Role",
      group: "IAM",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("actions"), map(pipe([get("ssmAutomation.roleArn")]))]),
    },
    snsTopics: {
      type: "Topic",
      group: "SNS",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("incidentTemplate.notificationTargets"),
          pluck("snsTopicArn"),
        ]),
    },
    snsTopicsChat: {
      type: "Topic",
      group: "SNS",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("chatChannel.chatbotSns")]),
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        actions: pipe([
          get("actions"),
          map(
            assign({
              ssmAutomation: pipe([
                get("ssmAutomation"),
                assign({
                  roleArn: pipe([
                    get("roleArn"),
                    replaceWithName({
                      groupType: "IAM::Role",
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
        chatChannel: pipe([
          get("chatChannel"),
          assign({
            chatbotSns: pipe([
              get("chatbotSns"),
              map(
                pipe([
                  replaceWithName({
                    groupType: "SNS::Topic",
                    path: "id",
                    providerConfig,
                    lives,
                  }),
                ])
              ),
            ]),
          }),
        ]),
        engagements: pipe([
          get("engagements"),
          map(
            pipe([
              // TODO escalation plan ?
              replaceWithName({
                groupType: "SSMContacts::Contact",
                path: "id",
                providerConfig,
                lives,
              }),
            ])
          ),
        ]),
        // TODO Integration PagerDuty
        incidentTemplate: pipe([
          get("incidentTemplate"),
          assign({
            notificationTargets: pipe([
              get("notificationTargets"),
              map(
                assign({
                  snsTopicArn: pipe([
                    get("snsTopicArn"),
                    replaceWithName({
                      groupType: "SNS::Topic",
                      path: "id",
                      providerConfig,
                      lives,
                    }),
                  ]),
                })
              ),
            ]),
          }),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSMIncidents.html#getResponsePlan-property
  getById: {
    method: "getResponsePlan",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSMIncidents.html#listResponsePlans-property
  getList: {
    method: "listResponsePlans",
    getParam: "responsePlanSummaries",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSMIncidents.html#createResponsePlan-property
  create: {
    method: "createResponsePlan",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSMIncidents.html#updateResponsePlan-property
  update: {
    method: "updateResponsePlan",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSMIncidents.html#deleteResponsePlan-property
  destroy: {
    method: "deleteResponsePlan",
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
    properties: { tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
    ])(),
});
