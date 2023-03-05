const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./ResourceExplorer2Common");

const buildArn = () =>
  pipe([
    get("ViewArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ ViewArn }) => {
    assert(ViewArn);
  }),
  pick(["ViewArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn({ config }), endpoint }),
    assign({
      ViewName: pipe([get("ViewArn"), callProp("split", "/"), (arr) => arr[1]]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ResourceExplorer2.html
exports.ResourceExplorer2View = () => ({
  type: "View",
  package: "resource-explorer-2",
  client: "ResourceExplorer2",
  propertiesDefault: {},
  omitProperties: ["ViewArn", "LastUpdatedAt", "Owner", "Scope"],
  inferName: () =>
    pipe([
      get("ViewName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      tap((name) => {
        assert(name);
      }),
      get("ViewName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("ViewArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["UnauthorizedException", "NotFoundException"],
  dependencies: {
    index: {
      type: "Index",
      group: "ResourceExplorer2",
      dependencyId: () => pipe([() => "default"]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ResourceExplorer2.html#getView-property
  getById: {
    method: "getView",
    getField: "View",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ResourceExplorer2.html#listViews-property
  getList: {
    method: "listViews",
    getParam: "Views",
    decorate: ({ getById }) => pipe([(ViewArn) => ({ ViewArn }), getById]),
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ResourceExplorer2.html#createView-property
  create: {
    method: "createView",
    pickCreated: ({ payload }) => pipe([get("View")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ResourceExplorer2.html#updateView-property
  update: {
    method: "updateView",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ResourceExplorer2.html#deleteView-property
  destroy: {
    method: "deleteView",
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
