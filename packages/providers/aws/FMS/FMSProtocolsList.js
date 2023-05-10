const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags, ignoreErrorCodes } = require("./FMSCommon");

const buildArn = () =>
  pipe([
    get("ProtocolsListArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ ListId }) => {
    assert(ListId);
  }),
  pick(["ListId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    ({ ProtocolsListArn, ...ProtocolsList }) => ({
      ...ProtocolsList,
      ProtocolsListArn,
    }),
    assignTags({ buildArn: buildArn(), endpoint }),
  ]);

const filterPayload = pipe([
  ({ Tags, ...ProtocolsList }) => ({ ProtocolsList, TagList: Tags }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FMS.html
exports.FMSProtocolsList = () => ({
  type: "ProtocolsList",
  package: "fms",
  client: "FMS",
  propertiesDefault: {},
  omitProperties: [
    "ListArn",
    "ListId",
    "ListUpdateToken",
    "CreateTime",
    "LastUpdateTime",
  ],
  inferName: () =>
    pipe([
      get("ListName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("ListName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("ListId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FMS.html#getProtocolsList-property
  getById: {
    method: "getProtocolsList",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FMS.html#listProtocolsLists-property
  getList: {
    enhanceParams: () => () => ({ MaxResults: 100 }),
    method: "listProtocolsLists",
    getParam: "ProtocolsLists",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FMS.html#putProtocolsList-property
  create: {
    filterPayload,
    method: "putProtocolsList",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FMS.html#putProtocolsList-property
  update: {
    method: "putProtocolsList",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        () => payload,
        filterPayload,
        defaultsDeep({ ListUpdateToken: live.ListUpdateToken }),
        defaultsDeep(pickId(live)),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FMS.html#deleteProtocolsList-property
  destroy: {
    method: "deleteProtocolsList",
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
