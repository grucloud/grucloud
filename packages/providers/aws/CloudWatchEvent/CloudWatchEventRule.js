const assert = require("assert");
const { assign, pipe, tap, get, eq, pick, omit } = require("rubico");
const { defaultsDeep, isEmpty, pluck, unless, append } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const {
  createEndpoint,
  buildTags,
  shouldRetryOnException,
} = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");

const findId = get("live.Name");
const pickId = pick(["Name", "EventBusName"]);
const findName = findId;

const cannotBeDeleted = get("live.ManagedBy");

const buildArn =
  ({ config }) =>
  ({ Name, EventBusName }) =>
    pipe([
      () => `arn:aws:events:${config.region}:${config.accountId()}:rule/`,
      unless(eq(EventBusName, "default"), append(`${EventBusName}/`)),
      append(Name),
    ])();

exports.CloudWatchEventRule = ({ spec, config }) => {
  const cloudWatchEvents = () =>
    createEndpoint({ endpointName: "CloudWatchEvents" })(config);
  const client = AwsClient({ spec, config });

  const findDependencies = ({ live, lives }) => [
    {
      type: "EventBus",
      group: "CloudWatchEvents",
      ids: [
        pipe([
          () => live,
          get("EventBusName"),
          (name) =>
            lives.getByName({
              name,
              type: "EventBus",
              group: "CloudWatchEvents",
              providerName: config.providerName,
            }),
          get("id"),
        ])(),
      ],
    },
  ];

  const decorate = () =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      assign({
        Targets: pipe([
          ({ Name, EventBusName }) => ({ Rule: Name, EventBusName }),
          //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#listTargetsByRule-property
          cloudWatchEvents().listTargetsByRule,
          get("Targets"),
        ]),
        Tags: pipe([
          buildArn({ config }),
          (ResourceARN) => ({ ResourceARN }),
          // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#listTagsForResource-property
          cloudWatchEvents().listTagsForResource,
          get("Tags"),
        ]),
      }),
      tap((params) => {
        assert(true);
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
    ignoreErrorCodes: ["ResourceNotFoundException"],
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
    pickCreated: (payload) => () => pipe([() => payload, pickId])(),
    method: "putRule",
    getById,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#putRule-property
  const update = client.update({
    pickId: omit(["Arn", "Targets"]),
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        omit(["Tags"]),
        defaultsDeep(pickId(live)),
        tap((params) => {
          assert(true);
        }),
      ])(),
    method: "putRule",
    getById,
    config,
  });

  const destroyTargets = pipe([
    ({ Targets, Name, EventBusName }) =>
      pipe([
        () => Targets,
        unless(
          isEmpty,
          pipe([
            pluck("Id"),
            (Ids) => ({
              Ids,
              Rule: Name,
              EventBusName,
            }),
            cloudWatchEvents().removeTargets,
          ])
        ),
      ])(),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#deleteRule-property
  const destroy = client.destroy({
    preDestroy: destroyTargets,
    pickId,
    method: "deleteRule",
    getById,
    ignoreError: eq(get("code"), "ResourceNotFoundException"),
    config,
  });

  const configDefault = async ({
    name,
    namespace,
    properties,
    dependencies: { eventBus },
  }) =>
    pipe([
      () => properties,
      defaultsDeep({
        Name: name,
        ...(eventBus && { EventBusName: getField(eventBus, "Name") }),
        Tags: buildTags({ config, namespace, name }),
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
    shouldRetryOnException,
    findDependencies,
    cannotBeDeleted,
    managedByOther: cannotBeDeleted,
  };
};
