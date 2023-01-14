const assert = require("assert");
const { pipe, tap, get, pick, map, eq, assign } = require("rubico");
const { defaultsDeep, append } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ MultiplexId, ProgramName }) => {
    assert(MultiplexId);
    assert(ProgramName);
  }),
  pick(["MultiplexId", "ProgramName"]),
]);

const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(live.MultiplexId);
    }),
    defaultsDeep({ MultiplexId: live.MultiplexId }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html
exports.MediaLiveMultiplexProgram = () => ({
  type: "MultiplexProgram",
  package: "medialive",
  client: "MediaLive",
  propertiesDefault: {},
  omitProperties: ["MultiplexId", "PacketIdentifiersMap", "ChannelId"],
  inferName:
    ({ dependenciesSpec: { multiplex } }) =>
    ({ ProgramName }) =>
      pipe([
        tap(() => {
          assert(multiplex);
          assert(ProgramName);
        }),
        () => `${multiplex}::${ProgramName}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ MultiplexId, ProgramName }) =>
      pipe([
        tap((params) => {
          assert(MultiplexId);
          assert(ProgramName);
        }),
        () => MultiplexId,
        lives.getById({
          type: "Multiplex",
          group: "MediaLive",
          providerName: config.providerName,
        }),
        get("name", MultiplexId),
        append(`::${ProgramName}`),
      ])(),
  findId:
    () =>
    ({ MultiplexId, ProgramName }) =>
      pipe([
        tap((params) => {
          assert(MultiplexId);
          assert(ProgramName);
        }),
        () => `${MultiplexId}::${ProgramName}`,
      ])(),
  ignoreErrorCodes: ["NotFoundException"],
  dependencies: {
    multiplex: {
      type: "Multiplex",
      group: "MediaLive",
      parent: true,
      dependencyId: () =>
        pipe([
          get("MultiplexId"),
          tap((MultiplexId) => {
            assert(MultiplexId);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html#describeMultiplexProgram-property
  getById: {
    method: "describeMultiplexProgram",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html#listMultiplexPrograms-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Multiplex", group: "MediaLive" },
          pickKey: pipe([
            pick(["MultiplexId"]),
            tap(({ MultiplexId }) => {
              assert(MultiplexId);
            }),
          ]),
          method: "listMultiplexPrograms",
          getParam: "MultiplexPrograms",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap((params) => {
                assert(parent.MultiplexId);
              }),
              defaultsDeep({ MultiplexId: parent.MultiplexId }),
              getById({}),
            ]),
        }),
    ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html#createMultiplexProgram-property
  create: {
    method: "createMultiplexProgram",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html#updateMultiplexProgram-property
  update: {
    method: "updateMultiplexProgram",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html#deleteMultiplexProgram-property
  destroy: {
    method: "deleteMultiplexProgram",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { multiplex },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(multiplex);
      }),
      () => otherProps,
      defaultsDeep({
        MultiplexId: getField(multiplex, "MultiplexId"),
      }),
    ])(),
});
