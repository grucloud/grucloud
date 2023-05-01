const assert = require("assert");
const { pipe, tap, get, eq, pick, assign } = require("rubico");
const { defaultsDeep, identity, when } = require("rubico/x");
const { omitIfEmpty } = require("@grucloud/core/Common");

const { getByNameCore } = require("@grucloud/core/Common");

const ignoreErrorMessages = ["Configuration ARN does not exist"];

const pickId = pipe([pick(["Arn"])]);

const decorate =
  ({ endpoint }) =>
  (live) =>
    pipe([
      () => live,
      when(
        get("LatestRevision.Revision"),
        pipe([
          () => ({ Arn: live.Arn, Revision: live.LatestRevision.Revision }),
          endpoint().describeConfigurationRevision,
          assign({
            ServerProperties: ({ ServerProperties }) =>
              Buffer.from(ServerProperties).toString(),
          }),
          defaultsDeep(live),
        ])
      ),
      omitIfEmpty(["KafkaVersions"]),
    ])();

exports.MSKConfiguration = ({}) => ({
  type: "Configuration",
  package: "kafka",
  client: "Kafka",
  inferName: () => get("Name"),
  findName: () => pipe([get("Name")]),
  findId: () => pipe([get("Arn")]),
  omitProperties: [
    "Arn",
    "CreationTime",
    "State",
    "LatestRevision",
    "Revision",
  ],
  filterLive: ({ lives, providerConfig }) =>
    pipe([omitIfEmpty(["KafkaVersions"])]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kafka.html#describeConfiguration-property
  getById: {
    method: "describeConfiguration",
    pickId,
    ignoreErrorMessages,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kafka.html#listConfigurations-property
  getList: {
    method: "listConfigurations",
    getParam: "Configurations",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kafka.html#createConfiguration-property
  create: {
    method: "createConfiguration",
    filterPayload: pipe([
      assign({
        ServerProperties: ({ ServerProperties }) =>
          Buffer.from(ServerProperties),
      }),
    ]),
    pickCreated: ({ payload }) => identity,
    isInstanceUp: eq(get("State"), "ACTIVE"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kafka.html#updateConfiguration-property
  update: {
    method: "updateConfiguration",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, defaultsDeep({ Arn: live.Arn })])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kafka.html#deleteConfiguration-property
  destroy: {
    method: "deleteConfiguration",
    pickId,
    ignoreErrorMessages: [
      "The request could not be processed because of an internal error. Try again.",
    ],
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
