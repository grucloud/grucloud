const assert = require("assert");
const { pipe, tap, get, pick, assign, map, omit } = require("rubico");
const { defaultsDeep, append, when, unless } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { replaceAccountAndRegion } = require("../AwsCommon");

const { Tagger } = require("./CloudWatchEventCommon");

const cannotBeDeleted = () => get("ManagedBy");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const assignArn = ({ config }) =>
  pipe([
    assign({
      Arn: pipe([
        ({ Name, EventBusName }) =>
          pipe([
            () => `arn:aws:events:${config.region}:${config.accountId()}:rule/`,
            unless(
              () => EventBusName === "default",
              append(`${EventBusName}/`)
            ),
            append(Name),
          ])(),
      ]),
    }),
  ]);

const assignTags = ({ endpoint, config }) =>
  pipe([
    assign({
      Tags: pipe([
        ({ Arn }) => ({ ResourceARN: Arn }),
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#listTagsForResource-property
        endpoint().listTagsForResource,
        get("Tags"),
      ]),
    }),
  ]);

const pickId = pipe([
  tap(({ Name, EventBusName }) => {
    assert(Name);
    //assert(EventBusName);
  }),
  pick(["Name", "EventBusName"]),
]);

const assignEvenPattern = assign({
  EventPattern: pipe([get("EventPattern"), JSON.stringify]),
});

const parseEventPattern = pipe([get("EventPattern", "{}"), JSON.parse]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignArn({ config }),
    assignTags({ endpoint, config }),
    when(
      get("EventPattern"),
      assign({
        EventPattern: parseEventPattern,
      })
    ),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvent.html
exports.CloudWatchEventRule = ({ compare }) => ({
  type: "Rule",
  package: "cloudwatch-events",
  client: "CloudWatchEvents",
  inferName: () => get("Name"),
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
  propertiesDefault: {},
  cannotBeDeleted,
  managedByOther: cannotBeDeleted,
  ignoreErrorCodes: ["ResourceNotFoundException"],
  omitProperties: ["Arn", "CreatedBy", "EventBusName"],
  compare: compare({
    filterTarget: () => pipe([defaultsDeep({ EventBusName: "default" })]),
  }),
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      when(
        get("EventPattern"),
        assign({
          EventPattern: pipe([
            get("EventPattern"),
            when(
              get("account"),
              assign({
                account: pipe([
                  get("account"),
                  map(
                    replaceAccountAndRegion({
                      providerConfig,
                      lives,
                    })
                  ),
                ]),
              })
            ),
          ]),
        })
      ),
    ]),
  dependencies: {
    eventBus: {
      type: "EventBus",
      group: "CloudWatchEvents",
      excludeDefaultDependencies: true,
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("EventBusName"),
          lives.getByName({
            type: "EventBus",
            group: "CloudWatchEvents",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvent.html#getRule-property
  getById: {
    pickId,
    method: "describeRule",
    decorate: () => pipe([assign({ EventPattern: parseEventPattern })]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvent.html#listRules-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "EventBus", group: "CloudWatchEvents" },
          pickKey: ({ Name }) => ({ EventBusName: Name }),
          method: "listRules",
          getParam: "Rules",
          config,
          decorate,
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvent.html#createRule-property
  create: {
    method: "putRule",
    filterPayload: pipe([assignEvenPattern]),
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvent.html#updateRule-property
  update: {
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
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvent.html#deleteRule-property
  destroy: {
    method: "deleteRule",
    pickId,
  },
  getByName:
    ({ getById }) =>
    ({ name, dependencies = () => ({}) }) =>
      pipe([
        dependencies,
        get("eventBus.name"),
        (EventBusName) => ({ Name: name, EventBusName }),
        getById({}),
      ])(),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { eventBus },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Name: name,
        ...(eventBus && { EventBusName: getField(eventBus, "Name") }),
        Tags: buildTags({ config, namespace, name, UserTags: Tags }),
      }),
    ])(),
});
