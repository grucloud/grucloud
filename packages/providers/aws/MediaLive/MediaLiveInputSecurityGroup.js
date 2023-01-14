const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./MediaLiveCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ InputSecurityGroupId }) => {
    assert(InputSecurityGroupId);
  }),
  pick(["InputSecurityGroupId"]),
]);

const toInputSecurityGroupId = ({ Id, ...other }) => ({
  InputSecurityGroupId: Id,
  ...other,
});

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    toInputSecurityGroupId,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html
exports.MediaLiveInputSecurityGroup = () => ({
  type: "InputSecurityGroup",
  package: "medialive",
  client: "MediaLive",
  propertiesDefault: {},
  omitProperties: ["InputSecurityGroupId", "Arn", "Inputs", "State"],
  inferName: () =>
    pipe([
      () => "isg",
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => "isg",
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      get("InputSecurityGroupId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["NotFoundException"],
  dependencies: {},
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html#describeInputSecurityGroup-property
  getById: {
    method: "describeInputSecurityGroup",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html#listInputSecurityGroups-property
  getList: {
    method: "listInputSecurityGroups",
    getParam: "InputSecurityGroups",
    decorate: ({ getById }) => pipe([toInputSecurityGroupId, getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html#createInputSecurityGroup-property
  create: {
    method: "createInputSecurityGroup",
    pickCreated: ({ payload }) =>
      pipe([get("SecurityGroup"), toInputSecurityGroupId]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html#updateInputSecurityGroup-property
  update: {
    method: "updateInputSecurityGroup",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html#deleteInputSecurityGroup-property
  destroy: {
    method: "deleteInputSecurityGroup",
    pickId,
    isInstanceDown: pipe([
      tap((params) => {
        assert(true);
      }),
      eq(get("State"), "DELETED"),
    ]),
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
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
    ])(),
});
