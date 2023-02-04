const assert = require("assert");
const { pipe, tap, get, eq, filter, assign, tryCatch } = require("rubico");
const { defaultsDeep, identity, pluck, when } = require("rubico/x");
const { replaceWithName } = require("@grucloud/core/Common");
const { updateResourceObject } = require("@grucloud/core/updateResourceObject");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags } = require("../AwsCommon");
const { Tagger } = require("./CloudTrailCommon");

const buildArn = () =>
  pipe([
    get("ChannelArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ ChannelArn }) => {
    assert(ChannelArn);
  }),
  ({ ChannelArn }) => ({ Channel: ChannelArn }),
  ,
]);

const assignResourcePolicy = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    tryCatch(
      pipe([
        tap(({ ChannelArn }) => {
          assert(ChannelArn);
        }),
        ({ ChannelArn }) => ({ ResourceArn: ChannelArn }),
        endpoint().getResourcePolicy,
        get("ResourcePolicy"),
        JSON.parse,
        (ResourcePolicy) => ({ ...live, ResourcePolicy }),
      ]),
      (error, live) => live
    ),
  ]);

const decorate = ({ endpoint }) =>
  pipe([
    //
    assignResourcePolicy({ endpoint }),
  ]);

const putResourcePolicy = ({ endpoint, live }) =>
  pipe([
    tap(({ ResourcePolicy }) => {
      assert(ResourcePolicy);
      assert(live.ChannelArn);
    }),
    ({ ResourcePolicy }) => ({
      ResourceArn: live.ChannelArn,
      ResourcePolicy: JSON.stringify(ResourcePolicy),
    }),
    endpoint().putResourcePolicy,
  ]);

const deleteResourcePolicy = ({ endpoint, live }) =>
  pipe([
    tap(({}) => {
      assert(live.ChannelArn);
    }),
    ({}) => ({
      ResourceArn: live.ChannelArn,
    }),
    endpoint().deleteResourcePolicy,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudTrail.html
exports.CloudTrailChannel = ({}) => ({
  type: "Channel",
  package: "cloudtrail",
  client: "CloudTrail",
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
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("ChannelArn"),
      tap((ChannelArn) => {
        assert(ChannelArn);
      }),
    ]),
  ignoreErrorCodes: ["ChannelNotFoundException"],
  omitProperties: ["ChannelArn", "IngestionStatus", "Policy"],
  dependencies: {
    eventDataStores: {
      type: "EventDataStore",
      group: "CloudTrail",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("Destinations"),
          filter(eq(get("Type"), "EVENT_DATA_STORE")),
          pluck("Location"),
        ]),
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        Destinations: pipe([
          get("Destinations"),
          map(
            when(
              eq(get("Type"), "EVENT_DATA_STORE"),
              assign({
                Location: pipe([
                  get("Location"),
                  replaceWithName({
                    groupType: "CloudTrail::EventDataStore",
                    path: "id",
                    providerConfig,
                    lives,
                  }),
                ]),
              })
            )
          ),
        ]),
      }),
    ]),
  getById: {
    method: "getChannel",
    pickId,
    decorate,
  },
  getList: {
    method: "listChannels",
    getParam: "Channels",
    decorate: ({ endpoint, getById }) => pipe([getById]),
  },
  create: {
    method: "createChannel",
    pickCreated: ({}) => pipe([identity]),
    postCreate:
      ({ endpoint, payload, created }) =>
      (live) =>
        pipe([
          () => payload,
          tap.if(
            get("ResourcePolicy"),
            pipe([putResourcePolicy({ endpoint, live })])
          ),
        ])(),
  },
  update: {
    preUpdate: ({ endpoint, payload, live, diff }) =>
      pipe([
        tap((params) => {
          assert(endpoint);
          assert(payload);
          assert(live);
          assert(diff);
        }),
        () => ({ payload, live, diff, endpoint }),
        updateResourceObject({
          path: "ResourcePolicy",
          onDeleted: deleteResourcePolicy,
          onAdded: putResourcePolicy,
          onUpdated: putResourcePolicy,
        }),
      ]),
    method: "updateChannel",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  destroy: {
    method: "deleteChannel",
    pickId,
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
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
