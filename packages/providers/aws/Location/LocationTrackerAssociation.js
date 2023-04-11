const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, find, unless, isEmpty, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ TrackerName, ConsumerArn }) => {
    assert(TrackerName);
    assert(ConsumerArn);
  }),
  pick(["TrackerName", "ConsumerArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Location.html
exports.LocationTrackerAssociation = () => ({
  type: "TrackerAssociation",
  package: "location",
  client: "Location",
  propertiesDefault: {},
  omitProperties: ["CreateTime", "TrackerArn", "CollectionArn", "UpdateTime"],
  inferName:
    ({ dependenciesSpec: { geofenceCollection } }) =>
    ({ TrackerName }) =>
      pipe([
        tap((params) => {
          assert(geofenceCollection);
          assert(TrackerName);
        }),
        () => `${geofenceCollection}::${TrackerName}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ TrackerName, CollectionArn }) =>
      pipe([
        tap((params) => {
          assert(CollectionArn);
          assert(TrackerName);
        }),
        () => CollectionArn,
        lives.getById({
          type: "GeofenceCollection",
          group: "Location",
          providerName: config.providerName,
        }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
        append(`::${TrackerName}`),
      ])(),
  findId: () =>
    pipe([
      tap(({ TrackerName, CollectionArn }) => {
        assert(TrackerName);
        assert(CollectionArn);
      }),
      ({ CollectionArn, TrackerName }) => `${CollectionArn}::${TrackerName}`,
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    geofenceCollection: {
      type: "GeofenceCollection",
      group: "Location",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("CollectionArn"),
          tap((CollectionArn) => {
            assert(CollectionArn);
          }),
        ]),
    },
    tracker: {
      type: "Tracker",
      group: "Location",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("TrackerName"),
          tap((TrackerName) => {
            assert(TrackerName);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Location.html#describeTracker-property
  getById: {
    method: "listTrackerConsumers",
    pickId,
    decorate: ({ live, endpoint, config }) =>
      pipe([
        get("ConsumerArns"),
        find(identity, live.ConsumerArn),
        unless(
          isEmpty,
          pipe([
            defaultsDeep({ TrackerName: live.TrackerName }),
            decorate({ endpoint, config }),
          ])
        ),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Location.html#listTrackerConsumers-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Tracker", group: "Location" },
          pickKey: pipe([pick(["TrackerName"])]),
          method: "listTrackerConsumers",
          getParam: "ConsumerArns",
          config,
          decorate: ({ parent }) =>
            pipe([
              (ConsumerArn) => ({
                ConsumerArn,
                TrackerName: parent.TrackerName,
              }),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Location.html#associateTrackerConsumer-property
  create: {
    method: "associateTrackerConsumer",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Location.html#disassociateTrackerConsumer-property
  destroy: {
    method: "disassociateTrackerConsumer",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { geofenceCollection, tracker },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(geofenceCollection);
        assert(tracker);
      }),
      () => otherProps,
      defaultsDeep({
        ConsumerArn: getField(geofenceCollection, "CollectionArn"),
        TrackerName: getField(tracker, "TrackerName"),
      }),
    ])(),
});
