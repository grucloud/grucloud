const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ ApplicationId }) => {
    assert(ApplicationId);
  }),
  pick(["ApplicationId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const filterPayload = pipe([
  tap(({ ApplicationId }) => {
    assert(ApplicationId);
  }),
  ({ ApplicationId, ...WriteEventStream }) => ({
    ApplicationId,
    WriteEventStream,
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Pinpoint.html
exports.PinpointEventStream = () => ({
  type: "EventStream",
  package: "pinpoint",
  client: "Pinpoint",
  propertiesDefault: {},
  omitProperties: [
    "ApplicationId",
    "CreationDate",
    "LastModifiedBy",
    "LastModifiedDate",
  ],
  inferName: ({ dependenciesSpec: { app } }) =>
    pipe([
      tap((params) => {
        assert(app);
      }),
      () => app,
    ]),
  findName:
    ({ lives, config }) =>
    ({ ApplicationId }) =>
      pipe([
        tap(() => {
          assert(ApplicationId);
        }),
        () => ApplicationId,
        lives.getById({
          type: "App",
          group: "Pinpoint",
          providerName: config.providerName,
        }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
      ])(),
  findId: () =>
    pipe([
      get("ApplicationId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["NotFoundException"],
  dependencies: {
    app: {
      type: "App",
      group: "Pinpoint",
      parent: true,
      dependencyId: () =>
        pipe([
          get("ApplicationId"),
          tap((ApplicationId) => {
            assert(ApplicationId);
          }),
        ]),
    },
    iamRole: {
      type: "Role",
      group: "IAM",
      pathId: "RoleArn",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("RoleArn"),
          tap((RoleArn) => {
            assert(RoleArn);
          }),
        ]),
    },
    firehoseDestinationStream: {
      type: "DeliveryStream",
      group: "Firehose",
      pathId: "DestinationStreamArn",
      dependencyId: () =>
        pipe([
          get("DestinationStreamArn"),
          tap((DestinationStreamArn) => {
            assert(DestinationStreamArn);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Pinpoint.html#getEventStream-property
  getById: {
    method: "getEventStream",
    getField: "EventStreamResponse",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Pinpoint.html#listEventStreams-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "App", group: "Pinpoint" },
          pickKey: pipe([
            pick(["ApplicationId"]),
            tap(({ ApplicationId }) => {
              assert(ApplicationId);
            }),
          ]),
          method: "getEventStream",
          getParam: "EventStream",
          config,
          decorate: ({ parent }) =>
            pipe([decorate({ endpoint, config, live: parent })]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Pinpoint.html#putEventStream-property
  create: {
    filterPayload,
    method: "putEventStream",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Pinpoint.html#putEventStream-property
  update: {
    method: "putEventStream",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, filterPayload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Pinpoint.html#deleteEventStream-property
  destroy: {
    method: "deleteEventStream",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { app, iamRole, firehoseDestinationStream },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(app);
        assert(firehoseDestinationStream);
      }),
      () => otherProps,
      defaultsDeep({
        ApplicationId: getField(app, "ApplicationId"),
        DestinationStreamArn: getField(
          firehoseDestinationStream,
          "DeliveryStreamARN"
        ),
      }),
      when(
        () => iamRole,
        defaultsDeep({
          RoleArn: getField(iamRole, "Arn"),
        })
      ),
    ])(),
});
