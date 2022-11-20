const assert = require("assert");
const { pipe, tap, get, eq, pick, assign } = require("rubico");
const { defaultsDeep, identity, when } = require("rubico/x");
const { omitIfEmpty } = require("@grucloud/core/Common");

const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

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

const model = ({ config }) => ({
  package: "mq",
  client: "Mq",
  ignoreErrorCodes,
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
});

exports.MQConfiguration = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: () => pipe([get("Name")]),
    findId: () => pipe([get("Id")]),
    cannotBeDeleted: () => () => true,
    getByName: getByNameCore,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: {},
    }) => pipe([() => otherProps, defaultsDeep({})])(),
  });
