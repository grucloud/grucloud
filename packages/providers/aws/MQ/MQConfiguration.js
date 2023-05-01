const assert = require("assert");
const { pipe, tap, get, eq, pick, assign, not, any, and } = require("rubico");
const { defaultsDeep, identity, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const ignoreErrorMessages = ["Configuration ARN does not exist"];
const ignoreErrorCodes = ["NotFoundException"];

const { Tagger } = require("./MQCommon");

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
  ({ Id }) => ({
    ConfigurationId: Id,
  }),
]);

const dataToBase64 = assign({
  Data: ({ Data }) => Buffer.from(Data).toString("base64"),
});

const decorate =
  ({ endpoint }) =>
  (live) =>
    pipe([
      tap((params) => {
        assert(live.Id);
      }),
      () => live,
      when(
        () => live.LatestRevision,
        assign({
          Data: pipe([
            tap((params) => {
              assert(live.LatestRevision.Revision);
            }),
            () => ({
              ConfigurationId: live.Id,
              ConfigurationRevision: live.LatestRevision.Revision,
            }),
            endpoint().describeConfigurationRevision,
            ({ Data }) => Buffer.from(Data, "base64").toString(),
          ]),
        })
      ),
    ])();

exports.MQConfiguration = ({}) => ({
  type: "Configuration",
  package: "mq",
  client: "Mq",
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
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findId: () =>
    pipe([
      get("Id"),
      tap((Id) => {
        assert(Id);
      }),
    ]),
  ignoreResource:
    ({ lives }) =>
    ({ live }) =>
      pipe([
        () => lives,
        not(
          any(
            and([
              eq(get("groupType"), "MQ::Broker"),
              eq(get("live.Configuration.Id"), live.Id),
            ])
          )
        ),
      ])(),
  omitProperties: [
    "Arn",
    "ConfigurationId",
    "Id",
    "Created",
    "State",
    "LatestRevision",
    "Revision",
  ],
  propertiesDefault: {},
  ignoreErrorCodes,
  cannotBeDeleted: () => () => true,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MQ.html#describeConfiguration-property
  getById: {
    method: "describeConfiguration",
    pickId,
    ignoreErrorMessages,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MQ.html#listConfigurations-property
  getList: {
    method: "listConfigurations",
    getParam: "Configurations",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MQ.html#createConfiguration-property
  create: {
    method: "createConfiguration",
    filterPayload: pipe([dataToBase64]),
    pickCreated: ({ payload }) => identity,
    //isInstanceUp: eq(get("State"), "ACTIVE"),
    postCreate:
      ({ payload }) =>
      (live) =>
        pipe([
          tap(() => {
            assert(live.Id);
          }),
          () => payload,
          pick(["Data", "Description"]),
          dataToBase64,
          defaultsDeep({ ConfigurationId: live.Id }),
        ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MQ.html#updateConfiguration-property
  update: {
    method: "updateConfiguration",
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        pick(["Data", "Description"]),
        dataToBase64,
        defaultsDeep({ ConfigurationId: live.Id }),
      ])(),
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
