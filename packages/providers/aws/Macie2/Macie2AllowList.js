const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, ignoreErrorCodes } = require("./Macie2Common");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);
const pickId = pipe([
  tap(({ id }) => {
    assert(id);
  }),
  pick(["id"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html
exports.Macie2AllowList = () => ({
  type: "AllowList",
  package: "macie2",
  client: "Macie2",
  propertiesDefault: {},
  omitProperties: ["id", "arn", "createdAt", "updatedAt", "status"],
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
      get("id"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes,
  dependencies: {
    account: {
      type: "Account",
      group: "Macie2",
      dependencyId: ({ lives, config }) => pipe([() => "default"]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#getAllowList-property
  getById: {
    method: "getAllowList",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#listAllowLists-property
  getList: {
    method: "listAllowLists",
    getParam: "allowLists",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#createAllowList-property
  create: {
    method: "createAllowList",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#updateAllowList-property
  update: {
    method: "updateAllowList",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#deleteAllowList-property
  destroy: {
    method: "deleteAllowList",
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
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
    ])(),
});
