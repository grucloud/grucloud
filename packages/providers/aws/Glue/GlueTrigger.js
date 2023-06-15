const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./GlueCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ Name }) => {
    assert(Name);
  }),
  pick(["Name"]),
]);

const assignArn = ({ config }) =>
  pipe([
    tap(({ Name }) => {
      assert(Name);
      assert(config);
    }),
    assign({
      Arn: pipe([
        ({ Name }) =>
          `arn:${config.partition}:glue:${
            config.region
          }:${config.accountId()}:trigger/${Name}`,
      ]),
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(config);
    }),
    assignArn({ config }),
    assignTags({ endpoint, buildArn: buildArn() }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html
exports.GlueTrigger = () => ({
  type: "Trigger",
  package: "glue",
  client: "Glue",
  propertiesDefault: {},
  omitProperties: ["Id", "State", "Arn"],
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
  ignoreErrorCodes: ["EntityNotFoundException"],
  dependencies: {
    crawlers: {
      type: "Crawler",
      group: "Glue",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("Actions"), pluck("CrawlerName")]),
    },
    jobs: {
      type: "Job",
      group: "Glue",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("Actions"), pluck("JobName")]),
    },
    workflow: {
      type: "Workflow",
      group: "Glue",
      dependencyId: ({ lives, config }) => pipe([get("WorkflowName")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#getTrigger-property
  getById: {
    method: "getTrigger",
    getField: "Trigger",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#getTriggers-property
  getList: {
    method: "getTriggers",
    getParam: "Triggers",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#createTrigger-property
  create: {
    method: "createTrigger",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#updateTrigger-property
  update: {
    method: "updateTrigger",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        () => payload,
        ({ Name, ...TriggerUpdate }) => ({
          Name,
          TriggerUpdate: { Name, ...TriggerUpdate },
        }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#deleteTrigger-property
  destroy: {
    method: "deleteTrigger",
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
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
    ])(),
});
