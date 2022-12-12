const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  assign,
  map,
  flatMap,
  switchCase,
} = require("rubico");
const { defaultsDeep, pluck, when, callProp, values } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./AppConfigCommon");

const managedByOther = () =>
  pipe([get("ExtensionIdentifier"), callProp("startsWith", "AWS.")]);

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ ExtensionIdentifier, VersionNumber }) => {
    assert(ExtensionIdentifier);
    assert(VersionNumber);
  }),
  pick(["ExtensionIdentifier"]),
]);

const idToExtensionIdentifier = ({ Id, ...other }) => ({
  ExtensionIdentifier: Id,
  ...other,
});

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    idToExtensionIdentifier,
    when(get("Arn"), assignTags({ buildArn: buildArn(config), endpoint })),
  ]);

const isOfArn = (arnType) =>
  pipe([get("Uri"), callProp("startsWith", arnType)]);

const assignUri = ({ groupType, providerConfig, lives }) =>
  assign({
    Uri: pipe([
      get("Uri"),
      replaceWithName({
        groupType,
        path: "id",
        providerConfig,
        lives,
      }),
    ]),
  });
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html
exports.AppConfigExtension = () => ({
  type: "Extension",
  package: "appconfig",
  client: "AppConfig",
  propertiesDefault: {},
  omitProperties: ["ExtensionIdentifier", "Arn"],
  managedByOther,
  cannotBeDeleted: managedByOther,
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("Arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    iamRoles: {
      type: "Role",
      group: "IAM",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("Actions"), values, flatMap(pipe([pluck("RoleArn")]))]),
    },
    lambdaFunctions: {
      type: "Function",
      group: "Lambda",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("Actions"), values, flatMap(pipe([pluck("Uri")]))]),
    },
    snsTopics: {
      type: "Topic",
      group: "SNS",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("Actions"), values, flatMap(pipe([pluck("Uri")]))]),
    },
    sqsQueues: {
      type: "Queue",
      group: "SQS",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("Actions"), values, flatMap(pipe([pluck("Uri")]))]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#getExtension-property
  getById: {
    method: "getExtension",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#listExtensions-property
  getList: {
    method: "listExtensions",
    getParam: "Items",
    filterResource: pipe([
      tap((params) => {
        assert(true);
      }),
      get("Arn"),
    ]),
    decorate: ({ getById }) => pipe([idToExtensionIdentifier, getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#createExtension-property
  create: {
    method: "createExtension",
    pickCreated: ({ payload }) => pipe([idToExtensionIdentifier]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#updateExtension-property
  update: {
    method: "updateExtension",
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#deleteExtension-property
  destroy: {
    method: "deleteExtension",
    pickId,
  },
  getByName: getByNameCore,
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        Actions: pipe([
          get("Actions"),
          map(
            pipe([
              map(
                pipe([
                  assign({
                    RoleArn: pipe([
                      get("RoleArn"),
                      replaceWithName({
                        groupType: "IAM::Role",
                        path: "id",
                        providerConfig,
                        lives,
                      }),
                    ]),
                  }),
                  switchCase([
                    isOfArn("arn:aws:sqs"),
                    assignUri({
                      groupType: "SQS::Queue",
                      providerConfig,
                      lives,
                    }),
                    isOfArn("arn:aws:sns"),
                    assignUri({
                      groupType: "SNS::Topic",
                      providerConfig,
                      lives,
                    }),
                    isOfArn("arn:aws:lambda"),
                    assignUri({
                      groupType: "Lambda::Function",
                      providerConfig,
                      lives,
                    }),
                    () => {
                      assert(false, "should be sqs, sns or lambda");
                    },
                  ]),
                ])
              ),
            ])
          ),
        ]),
      }),
    ]),
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
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
    ])(),
});
