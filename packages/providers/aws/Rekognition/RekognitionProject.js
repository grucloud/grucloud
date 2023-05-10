const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, isIn, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ ProjectArn }) => {
    assert(ProjectArn);
  }),
  pick(["ProjectArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rekognition.html
exports.RekognitionProject = () => ({
  type: "Project",
  package: "rekognition",
  client: "Rekognition",
  propertiesDefault: {},
  omitProperties: ["ProjectArn", "CreationTimestamp", "Status"],
  inferName: () =>
    pipe([
      get("ProjectName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("ProjectName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("ProjectArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException", "InvalidParameterException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rekognition.html#describeProjects-property
  getById: {
    method: "describeProjects",
    getField: "ProjectDescriptions",
    pickId: pipe([
      tap(({ ProjectName }) => {
        assert(ProjectName);
      }),
      ({ ProjectName }) => ({ ProjectNames: [ProjectName] }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rekognition.html#describeProjects-property
  getList: {
    method: "describeProjects",
    getParam: "ProjectDescriptions",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rekognition.html#createProject-property
  create: {
    method: "createProject",
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: pipe([get("Status"), isIn(["CREATED"])]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rekognition.html#updateProject-property
  // No update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rekognition.html#deleteProject-property
  destroy: {
    method: "deleteProject",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
