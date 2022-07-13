const assert = require("assert");
const { pipe, tap, get, omit, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource, assignTags } = require("./GlueCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const findId = pipe([
  tap((params) => {
    assert(params);
  }),
  get("live.Name"),
]);

const buildArn =
  ({ config }) =>
  ({ Name }) =>
    `arn:aws:glue:${config.region}:${config.accountId()}:job/${Name}`;

const pickId = pipe([
  tap((params) => {
    assert(params);
  }),
  ({ Name }) => ({ JobName: Name }),
]);

const model = ({ config }) => ({
  package: "glue",
  client: "Glue",
  ignoreErrorCodes: ["EntityNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#getJob-property
  getById: {
    method: "getJob",
    pickId,
    getField: "Job",
    decorate: ({ endpoint }) =>
      pipe([
        tap((params) => {
          assert(params);
        }),
        assignTags({ endpoint, findId: buildArn({ config }) }),
        tap((params) => {
          assert(params);
        }),
      ]),
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
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#createJob-property
  create: {
    method: "createJob",
    pickCreated: ({ payload }) => pipe([() => payload]),
    postCreate:
      ({ endpoint }) =>
      (live) =>
        pipe([() => live])(),
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
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html
exports.GlueJob = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.Name")]),
    findId,
    getByName: ({ getList, endpoint, getById }) =>
      pipe([({ name }) => ({ Name: name }), getById]),
    findDependencies: ({ live }) => [
      {
        type: "Role",
        group: "IAM",
        ids: [live.Role],
      },
    ],
    tagResource: tagResource({ findId: buildArn({ config }) }),
    untagResource: untagResource({ findId: buildArn({ config }) }),
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { role },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
          Role: getField(role, "Arn"),
        }),
      ])(),
  });
