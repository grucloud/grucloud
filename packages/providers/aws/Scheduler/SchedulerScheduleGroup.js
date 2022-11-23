const assert = require("assert");
const { pipe, tap, get, pick, eq, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { buildTags } = require("../AwsCommon");

const { createAwsResource } = require("../AwsClient");

const { Tagger, assignClientToken } = require("./SchedulerCommon");

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

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assign({
      Tags: pipe([
        buildArn(),
        (ResourceArn) => ({
          ResourceArn,
        }),
        endpoint().listTagsForResource,
        get("Tags"),
      ]),
    }),
  ]);

const cannotBeDeleted = () => pipe([eq(get("Name"), "default")]);

const model = ({ config }) => ({
  package: "scheduler",
  client: "Scheduler",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ScheduleGroupr.html#getScheduleGroup-property
  getById: {
    method: "getScheduleGroup",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ScheduleGroupr.html#listScheduleGroupGroups-property
  getList: {
    method: "listScheduleGroups",
    getParam: "ScheduleGroups",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ScheduleGroupr.html#createScheduleGroup-property
  create: {
    method: "createScheduleGroup",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([eq(get("State"), "ACTIVE")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ScheduleGroupr.html#deleteScheduleGroup-property
  destroy: {
    method: "deleteScheduleGroup",
    pickId: pipe([pickId, assignClientToken]),
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ScheduleGroupr.html
exports.SchedulerScheduleGroup = ({ compare }) => ({
  type: "ScheduleGroup",
  propertiesDefault: {},
  omitProperties: ["Arn", "CreationDate", "LastModificationDate", "State"],
  inferName: () => get("Name"),
  // compare: compare({
  //   filterAll: () => pipe([() => ({})]),
  // }),
  Client: ({ spec, config }) =>
    createAwsResource({
      model: model({ config }),
      spec,
      config,
      managedByOther: cannotBeDeleted,
      cannotBeDeleted,
      findName: () =>
        pipe([
          get("Name"),
          tap((name) => {
            assert(name);
          }),
        ]),
      findId: () =>
        pipe([
          get("Name"),
          tap((id) => {
            assert(id);
          }),
        ]),
      getByName: ({ getById }) =>
        pipe([({ name }) => ({ Name: name }), getById({})]),
      ...Tagger({ buildArn: buildArn(config) }),
      configDefault: ({
        name,
        namespace,
        properties: { Tags, ...otherProps },
        dependencies: {},
      }) =>
        pipe([
          () => otherProps,
          defaultsDeep({
            Tags: buildTags({ name, config, namespace, UserTags: Tags }),
          }),
        ])(),
    }),
});
