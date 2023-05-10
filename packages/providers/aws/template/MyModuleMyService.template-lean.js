const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  assign,
  map,
  and,
  or,
  not,
  filter,
  fork,
} = require("rubico");
const {
  defaultsDeep,
  isIn,
  first,
  pluck,
  callProp,
  when,
  isEmpty,
  unless,
  identity,
} = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { buildTagsObject } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

// const {
//   Tagger,
//   //assignTags,
// } = require("./MyModuleCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ MyId }) => {
    assert(MyId);
  }),
  pick(["MyId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html
exports.MyModuleMyResource = () => ({
  type: "MyResource",
  package: "myModule",
  client: "MyModule",
  propertiesDefault: {},
  omitProperties: [],
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
      get("Arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html#getMyResource-property
  getById: {
    method: "getMyResource",
    getField: "MyResource",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html#listMyResources-property
  getList: {
    method: "listMyResources",
    getParam: "MyResources",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html#createMyResource-property
  create: {
    method: "createMyResource",
    pickCreated: ({ payload }) => pipe([get("MyResource")]),
    // pickCreated: ({ payload }) => pipe([() => payload]),
    // pickCreated: ({ payload }) => pipe([identity]),
    // isInstanceUp: pipe([get("State"), isIn(["RUNNING"])]),
    // isInstanceError: pipe([get("State"), isIn(["FAILED"])]),
    // getErrorMessage: pipe([get("StateChangeReason.Message", "FAILED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html#updateMyResource-property
  update: {
    method: "updateMyResource",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html#deleteMyResource-property
  destroy: {
    method: "deleteMyResource",
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
