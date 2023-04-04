const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, find, identity, unless, isEmpty } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./DetectiveCommon");

const buildArn = () =>
  pipe([
    get("GraphArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ GraphArn }) => {
    assert(GraphArn);
  }),
  pick(["GraphArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn({ config }), endpoint }),
  ]);

const toGraphArn = ({ Arn, ...other }) => ({ GraphArn: Arn, ...other });

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Detective.html
exports.DetectiveGraph = () => ({
  type: "Graph",
  package: "detective",
  client: "Detective",
  propertiesDefault: {},
  omitProperties: ["GraphArn", "CreatedTime"],
  inferName: () => pipe([() => "default"]),
  findName: () => pipe([() => "default"]),
  findId: () =>
    pipe([
      get("GraphArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException", "AccessDeniedException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Detective.html#listGraphs-property
  getById: {
    method: "listGraphs",
    pickId,
    decorate: ({ live, config, endpoint }) =>
      pipe([
        tap((params) => {
          assert(live.GraphArn);
        }),
        get("GraphList"),
        find(eq(get("GraphArn"), live.GraphArn)),
        unless(isEmpty, decorate({ config, endpoint })),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Detective.html#listGraphs-property
  getList: {
    method: "listGraphs",
    getParam: "GraphList",
    decorate: ({ config }) => pipe([toGraphArn, decorate({ config })]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Detective.html#createGraph-property
  create: {
    method: "createGraph",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Detective.html#deleteGraph-property
  destroy: {
    method: "deleteGraph",
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
