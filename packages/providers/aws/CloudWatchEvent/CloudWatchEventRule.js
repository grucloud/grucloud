const assert = require("assert");
const { assign, pipe, tap, get, eq, pick, omit } = require("rubico");
const { defaultsDeep, when, unless, append } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const {
  createCloudWatchEvents,
  ignoreErrorCodes,
  tagResource,
  untagResource,
} = require("./CloudWatchEventCommon");

const findId = get("live.Arn");
const pickId = pick(["Name", "EventBusName"]);
const findName = get("live.Name");

const cannotBeDeleted = get("live.ManagedBy");

const buildArn =
  ({ config }) =>
  ({ Name, EventBusName }) =>
    pipe([
      () => `arn:aws:events:${config.region}:${config.accountId()}:rule/`,
      unless(() => EventBusName === "default", append(`${EventBusName}/`)),
      append(Name),
    ])();

const assignEvenPattern = assign({
  EventPattern: pipe([get("EventPattern"), JSON.stringify]),
});

const parseEventPattern = pipe([get("EventPattern", "{}"), JSON.parse]);

exports.CloudWatchEventRule = ({ spec, config }) => {
  const cloudWatchEvents = createCloudWatchEvents(config);
  const client = AwsClient({ spec, config })(cloudWatchEvents);

  const decorate = () =>
    pipe([
      when(
        get("EventPattern"),
        assign({
          EventPattern: parseEventPattern,
        })
      ),
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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#listRules-property
  const getList = client.getListWithParent({
    parent: { type: "EventBus", group: "CloudWatchEvents" },
    pickKey: ({ Name }) => ({ EventBusName: Name }),
    method: "listRules",
    getParam: "Rules",
    config,
    decorate,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#describeRule-property
  const getById = client.getById({
    pickId,
    method: "describeRule",
    ignoreErrorCodes,
    decorate: () => pipe([assign({ EventPattern: parseEventPattern })]),
  });

  const getByName = ({ name, dependencies = () => ({}) }) =>
    pipe([
      dependencies,
      get("eventBus.name"),
      (EventBusName) => ({ Name: name, EventBusName }),
      getById,
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#putRule-property
  const create = client.create({
    method: "putRule",
    filterPayload: pipe([assignEvenPattern]),
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#putRule-property
  const update = client.update({
    pickId: omit(["Arn", "Targets"]),
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        omit(["Tags"]),
        assignEvenPattern,
        defaultsDeep(pickId(live)),
        tap((params) => {
          assert(true);
        }),
      ])(),
    method: "putRule",
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#deleteRule-property
  const destroy = client.destroy({
    pickId,
    method: "deleteRule",
    getById,
    ignoreErrorCodes,
  });

  const configDefault = async ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { eventBus },
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Name: name,
        ...(eventBus && { EventBusName: getField(eventBus, "Name") }),
        Tags: buildTags({ config, namespace, name, UserTags: Tags }),
      }),
    ])();

  return {
    spec,
    findName,
    findId,
    create,
    update,
    destroy,
    getByName,
    getList,
    configDefault,
    cannotBeDeleted,
    managedByOther: cannotBeDeleted,
    tagResource: tagResource({ cloudWatchEvents }),
    untagResource: untagResource({ cloudWatchEvents }),
  };
};
