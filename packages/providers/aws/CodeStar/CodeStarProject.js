const assert = require("assert");
const { pipe, map, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./CodeStarCommon");

const pickId = pipe([
  tap(({ id }) => {
    assert(id);
  }),
  pick(["id"]),
]);

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeStar.html
exports.CodeStarProject = ({}) => ({
  type: "Project",
  package: "codestar",
  client: "CodeStar",
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
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findId: () => pipe([get("arn")]),
  getByName: getByNameCore,
  ignoreErrorCodes: ["ProjectNotFoundException"],
  omitProperties: [
    "arn",
    "id",
    "clientRequestToken",
    "createdTimeStamp",
    "stackId",
    "projectTemplateId",
    "status",
  ],
  // TODO
  dependencies: {},
  propertiesDefault: {},
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeStar.html#describeProject-property
  getById: {
    method: "describeProject",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeStar.html#listProjects-property
  getList: {
    method: "listProjects",
    getParam: "Projects",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeStar.html#createProject-property
  create: {
    method: "createProject",
    pickCreated: ({ payload }) => identity,
    // isInstanceUp: pipe([get("status.state"), isIn(["RUNNING"])]),
    // isInstanceError: pipe([get("status.state"), isIn(["FAILED"])]),
    // getErrorMessage: pipe([get("status.reason", "FAILED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeStar.html#deleteProject-property
  destroy: { method: "deleteProject", pickId },
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
        tags: buildTagsObject({
          name,
          config,
          namespace,
          userTags: tags,
        }),
      }),
    ])(),
});
