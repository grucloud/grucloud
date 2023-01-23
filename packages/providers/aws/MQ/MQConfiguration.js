const assert = require("assert");
const { pipe, tap, get, eq, pick, assign, not, any, and } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const ignoreErrorMessages = ["Configuration ARN does not exist"];
const ignoreErrorCodes = ["NotFoundException"];

const pickId = pipe([
  tap(({ Id, LatestRevision }) => {
    assert(Id);
    assert(LatestRevision);
  }),
  ({ Id, LatestRevision }) => ({
    ConfigurationId: Id,
    ConfigurationRevision: LatestRevision.Revision,
  }),
]);

const decorate =
  ({ endpoint }) =>
  (live) =>
    pipe([
      tap((params) => {
        assert(live.LatestRevision.Revision);
      }),
      () => live,
      assign({
        Data: pipe([
          () => ({
            ConfigurationId: live.Id,
            ConfigurationRevision: live.LatestRevision.Revision,
          }),
          endpoint().describeConfigurationRevision,
          ({ Data }) => Buffer.from(Data, "base64").toString(),
        ]),
      }),
    ])();

const dataToBase64 = assign({
  Data: ({ Data }) => Buffer.from(Data).toString("base64"),
});

exports.MQConfiguration = ({}) => ({
  type: "Configuration",
  package: "mq",
  client: "Mq",
  inferName: () => get("Name"),
  findName: () => pipe([get("Name")]),
  findId: () => pipe([get("Id")]),
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
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MQ.html#createConfiguration-property
  create: {
    method: "createConfiguration",
    filterPayload: pipe([dataToBase64]),
    pickCreated: ({ payload }) => identity,
    //isInstanceUp: eq(get("State"), "ACTIVE"),
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
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
