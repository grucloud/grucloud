const assert = require("assert");
const { pipe, tap, get, pick, map, assign } = require("rubico");
const { defaultsDeep, when, identity } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { Tagger } = require("./IvschatCommon");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap((params) => {
    assert(true);
  }),
  ({ arn }) => ({ identifier: arn }),
  tap(({ identifier }) => {
    assert(identifier);
  }),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Ivschat.html
exports.IvschatRoom = ({ compare }) => ({
  type: "Room",
  package: "ivschat",
  client: "Ivschat",
  propertiesDefault: {
    maximumMessageLength: 500,
    maximumMessageRatePerSecond: 10,
    messageReviewHandler: {
      fallbackResult: "ALLOW",
      uri: "",
    },
  },
  omitProperties: [
    "identifier",
    "arn",
    "createTime",
    "id",
    "loggingConfigurationIdentifiers",
    "updateTime",
  ],
  inferName: () =>
    pipe([
      get("name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    loggingConfigurations: {
      type: "LoggingConfiguration",
      group: "Ivschat",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("loggingConfigurationIdentifiers"),
          tap((params) => {
            assert(true);
          }),
        ]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Ivschat.html#getRoom-property
  getById: {
    method: "getRoom",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Ivschat.html#listRooms-property
  getList: {
    method: "listRooms",
    getParam: "rooms",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Ivschat.html#createRoom-property
  create: {
    method: "createRoom",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Ivschat.html#updateRoom-property
  update: {
    method: "updateRoom",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Ivschat.html#deleteRoom-property
  destroy: {
    method: "deleteRoom",
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
    properties: { tags, ...otherProps },
    dependencies: { loggingConfigurations },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
      when(
        () => loggingConfigurations,
        defaultsDeep({
          loggingConfigurationIdentifiers: pipe([
            () => loggingConfigurations,
            map((loggingConfiguration) =>
              getField(loggingConfiguration, "arn")
            ),
          ])(),
        })
      ),
    ])(),
});
