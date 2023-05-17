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
// } = require("./CodeCatalystCommon");

// const buildArn = () =>
//   pipe([
//     get("Arn"),
//     tap((arn) => {
//       assert(arn);
//     }),
//   ]);

const pickId = pipe([
  tap(({ name }) => {
    assert(name);
  }),
  pick(["name"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCatalyst.html
exports.CodeCatalystSpace = () => ({
  type: "Space",
  package: "codecatalyst",
  client: "CodeCatalyst",
  propertiesDefault: {},
  omitProperties: [],
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
      get("name"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCatalyst.html#getSpace-property
  getById: {
    method: "getSpace",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCatalyst.html#listSpaces-property
  getList: {
    method: "listSpaces",
    getParam: "items",
    decorate: ({ getById }) => pipe([getById]),
  },
  // TODO no create and destroy API yet
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCatalyst.html#createSpace-property
  //   create: {
  //     method: "createSpace",
  //     pickCreated: ({ payload }) => pipe([get("Space")]),
  //     // pickCreated: ({ payload }) => pipe([() => payload]),
  //     // pickCreated: ({ payload }) => pipe([identity]),
  //     // isInstanceUp: pipe([get("State"), isIn(["RUNNING"])]),
  //     // isInstanceError: pipe([get("State"), isIn(["FAILED"])]),
  //     // getErrorMessage: pipe([get("StateChangeReason.Message", "FAILED")]),
  //   },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCatalyst.html#updateSpace-property
  //   update: {
  //     method: "updateSpace",
  //     filterParams: ({ payload, diff, live }) =>
  //       pipe([() => payload, defaultsDeep(pickId(live))])(),
  //   },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCatalyst.html#deleteSpace-property
  //   destroy: {
  //     method: "deleteSpace",
  //     pickId,
  //   },
  getByName: getByNameCore,
  //   tagger: ({ config }) =>
  //     Tagger({
  //       buildArn: buildArn({ config }),
  //     }),
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
        // TODO
        // Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
