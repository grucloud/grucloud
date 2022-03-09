const assert = require("assert");
const { assign, pipe, tap, get, eq, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { buildTags } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const {
  createCloudWatchEvents,
  ignoreErrorCodes,
  tagResource,
  untagResource,
} = require("./CloudWatchEventCommon");

const findId = get("live.Arn");
const pickId = pick(["Name"]);
const findName = get("live.Name");

const isDefault = eq(get("live.Name"), "default");

const buildArn =
  ({ config }) =>
  ({ Name }) =>
    `arn:aws:events:${config.region}:${config.accountId()}:event-bus/${Name}`;

exports.CloudWatchEventBus = ({ spec, config }) => {
  const cloudWatchEvents = createCloudWatchEvents(config);
  const client = AwsClient({ spec, config })(cloudWatchEvents);

  // findDependencies for CloudWatchEventBus
  const findDependencies = ({ live, lives }) => [];

  const decorate = () =>
    pipe([
      assign({
        Tags: pipe([
          buildArn({ config }),
          (ResourceARN) => ({ ResourceARN }),
          // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#listTagsForResource-property
          cloudWatchEvents().listTagsForResource,
          get("Tags"),
        ]),
      }),
    ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#listEventBuses-property
  const getList = client.getList({
    method: "listEventBuses",
    getParam: "EventBuses",
    decorate,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#describeEventBus-property
  const getById = client.getById({
    pickId,
    method: "describeEventBus",
    ignoreErrorCodes,
  });

  const getByName = pipe([({ name }) => ({ Name: name }), getById]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#createEventBus-property
  const create = client.create({
    method: "createEventBus",
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#deleteEventBus-property
  const destroy = client.destroy({
    pickId,
    method: "deleteEventBus",
    getById,
    ignoreErrorCodes,
  });

  const configDefault = async ({
    name,
    namespace,
    properties,
    dependencies: {},
  }) =>
    pipe([
      () => properties,
      defaultsDeep({
        Name: name,
        Tags: buildTags({ config, namespace, name }),
      }),
    ])();

  return {
    spec,
    findName,
    findId,
    create,
    destroy,
    getByName,
    getList,
    configDefault,
    findDependencies,
    cannotBeDeleted: isDefault,
    managedByOther: isDefault,
    isDefault,
    tagResource: tagResource({ cloudWatchEvents }),
    tagResource: untagResource({ cloudWatchEvents }),
  };
};
