const assert = require("assert");
const { pipe, tap, get, set, assign, tryCatch } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./ResourceGroupsCommon");

const buildArn = () =>
  pipe([
    get("GroupArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ GroupArn }) => {
    assert(GroupArn);
  }),
  ({ GroupArn }) => ({ Group: GroupArn }),
]);

const filterPayload = pipe([
  when(
    get("ResourceQuery.Query"),
    set(
      "ResourceQuery.Query",
      pipe([get("ResourceQuery.Query"), JSON.stringify])
    )
  ),
  tap((arn) => {
    assert(arn);
  }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn, endpoint }),
    (data) =>
      tryCatch(
        pipe([
          () => data,
          pickId,
          endpoint().getGroupConfiguration,
          get("GroupConfiguration"),
          (GroupConfiguration) => ({ ...data, GroupConfiguration }),
        ]),
        (error) => data
      )(),
    assign({
      ResourceQuery: pipe([
        pickId,
        endpoint().getGroupQuery,
        get("GroupQuery.ResourceQuery"),
        assign({ Query: pipe([get("Query"), JSON.parse]) }),
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ResourceGroups.html
exports.ResourceGroupsGroup = () => ({
  type: "Group",
  package: "resource-groups",
  client: "ResourceGroups",
  propertiesDefault: {},
  omitProperties: ["GroupArn", "OwnerId"],
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
      get("GroupArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ResourceGroups.html#getGroup-property
  getById: {
    method: "getGroup",
    getField: "Group",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ResourceGroups.html#listGroups-property
  getList: {
    method: "listGroups",
    getParam: "GroupIdentifiers",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ResourceGroups.html#createGroup-property
  create: {
    filterPayload,
    method: "createGroup",
    pickCreated: ({ payload }) => pipe([get("Group")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ResourceGroups.html#updateGroup-property
  update: {
    method: "updateGroup",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ResourceGroups.html#deleteGroup-property
  destroy: {
    method: "deleteGroup",
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
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
    ])(),
});
