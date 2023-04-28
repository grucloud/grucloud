const assert = require("assert");
const { pipe, tap, get, omit, assign, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./GlueCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const findId = () =>
  pipe([
    get("Name"),
    tap((id) => {
      assert(id);
    }),
  ]);

const assignArn = ({ config }) =>
  pipe([
    assign({
      Arn: pipe([
        ({ Name }) =>
          `arn:aws:glue:${config.region}:${config.accountId()}:job/${Name}`,
      ]),
    }),
  ]);

const pickId = pipe([
  tap((params) => {
    assert(params);
  }),
  ({ Name }) => ({ JobName: Name }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    assignArn({ config }),
    assignTags({ endpoint, buildArn: buildArn() }),
    tap((params) => {
      assert(params);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html
exports.GlueJob = () => ({
  type: "Job",
  package: "glue",
  client: "Glue",
  ignoreErrorCodes: ["EntityNotFoundException"],
  inferName: () => get("Name"),
  findName: () => pipe([get("Name")]),
  findId,
  omitProperties: [
    "CreatedOn",
    "LastModifiedOn",
    "AllocatedCapacity",
    "MaxCapacity",
    "Role",
    "Arn",
  ],
  propertiesDefault: {},
  dependencies: {
    role: {
      type: "Role",
      group: "IAM",
      dependencyId: () => pipe([get("Role")]),
    },
  },
  getByName: ({ getList, endpoint, getById }) =>
    pipe([({ name }) => ({ Name: name }), getById({})]),
  getById: {
    method: "getJob",
    pickId,
    getField: "Job",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#listJobs-property
  getList: {
    method: "listJobs",
    getParam: "JobNames",
    decorate: ({ getById }) =>
      pipe([
        tap((params) => {
          assert(params);
        }),
        (name) => ({ Name: name }),
        getById,
      ]),
    noSortKey: true,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#createJob-property
  create: {
    method: "createJob",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#updateJob-property
  update: {
    method: "updateJob",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, omit(["Tags"])])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#deleteJob-property
  destroy: {
    method: "deleteJob",
    pickId,
  },
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { role },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(role);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
        Role: getField(role, "Arn"),
      }),
    ])(),
});
