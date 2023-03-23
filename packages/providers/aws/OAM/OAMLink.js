const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, when, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./OAMCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ Identifier }) => {
    assert(Identifier);
  }),
  pick(["Identifier"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap(({ Id }) => {
      assert(Id);
    }),
    ({ Id, SinkArn, ...other }) => ({
      Identifier: Id,
      SinkIdentifier: SinkArn,
      ...other,
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OAM.html
exports.OAMLink = () => ({
  type: "Link",
  package: "oam",
  client: "OAM",
  propertiesDefault: {},
  omitProperties: ["Arn", "Id", "SinkIdentifier"],
  inferName: () =>
    pipe([
      get("LabelTemplate"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("LabelTemplate"),
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
  dependencies: {
    sink: {
      type: "Sink",
      group: "OAM",
      dependencyId: ({ lives, config }) => pipe([get("SinkIdentifier")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OAM.html#getLink-property
  getById: {
    method: "getLink",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OAM.html#listLinks-property
  getList: {
    method: "listLinks",
    getParam: "Items",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OAM.html#createLink-property
  create: {
    method: "createLink",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OAM.html#updateLink-property
  update: {
    method: "updateLink",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OAM.html#deleteLink-property
  destroy: {
    method: "deleteLink",
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
    dependencies: { sink },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
      when(() => sink, defaultsDeep({ SinkIdentifier: getField(sink, "Id") })),
    ])(),
});
