const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ SinkIdentifier }) => {
    assert(SinkIdentifier);
  }),
  pick(["SinkIdentifier"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assign({ Policy: pipe([get("Policy"), JSON.parse]) }),
  ]);

const filterPayload = pipe([
  assign({ Policy: pipe([get("Policy"), JSON.stringify]) }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OAM.html
exports.OAMSinkPolicy = () => ({
  type: "SinkPolicy",
  package: "oam",
  client: "OAM",
  propertiesDefault: {},
  omitProperties: ["SinkArn", "SinkId"],
  cannotBeDeleted: () => () => true,
  inferName:
    ({ dependenciesSpec: { sink } }) =>
    ({}) =>
      pipe([
        tap((params) => {
          assert(sink);
        }),
        () => `${sink}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ SinkArn }) =>
      pipe([
        tap((params) => {
          assert(SinkArn);
        }),
        () => SinkArn,
        lives.getById({
          type: "Sink",
          group: "OAM",
          providerName: config.providerName,
        }),
        get("name", SinkArn),
        tap((name) => {
          assert(name);
        }),
      ])(),
  findId: () =>
    pipe([
      get("SinkArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    sink: {
      type: "Sink",
      group: "OAM",
      parent: true,
      dependencyId: () =>
        pipe([
          get("SinkArn"),
          tap((SinkArn) => {
            assert(SinkArn);
          }),
        ]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OAM.html#getSinkPolicy-property
  getById: {
    method: "getSinkPolicy",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OAM.html#getSinkPolicy-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Sink", group: "OAM" },
          pickKey: pipe([
            tap(({ Identifier }) => {
              assert(Identifier);
            }),
            ({ Identifier }) => ({ SinkIdentifier: Identifier }),
          ]),
          method: "getSinkPolicy",
          config,
          decorate,
        }),
    ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OAM.html#createSinkPolicy-property
  create: {
    filterPayload,
    method: "putSinkPolicy",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OAM.html#updateSinkPolicy-property
  update: {
    method: "putSinkPolicy",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, filterPayload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OAM.html#deleteSinkPolicy-property
  // destroy: {
  //   method: "putSinkPolicy",
  //   pickId: pipe([pickId, defaultsDeep({ Policy: "{}" })]),
  // },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { sink },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(sink);
      }),
      () => otherProps,
      defaultsDeep({ SinkArn: getField(sink, "Arn") }),
    ])(),
});
