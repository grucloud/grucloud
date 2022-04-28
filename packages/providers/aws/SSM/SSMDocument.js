const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./SSMCommon");

const model = ({ config }) => ({
  package: "ssm",
  client: "SSM",
  ignoreErrorCodes: ["InvalidDocument"],
  getById: { method: "describeDocument", getField: "Document" },
  getList: {
    method: "listDocuments",
    enhanceParams: () =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        assign({
          Filters: () => [{ Key: "Owner", Values: ["Self"] }],
        }),
        tap((params) => {
          assert(true);
        }),
      ]),
    getParam: "DocumentIdentifiers",
  },
  create: { method: "createDocument" },
  update: { method: "updateDocument" },
  destroy: { method: "deleteDocument" },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html
exports.SSMDocument = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: get("live.Name"),
    findId: pipe([
      get("live.Name"),
      (Name) =>
        `arn:aws:ssm:${config.region}:${config.accountId()}:document/${Name}`,
    ]),
    pickId: pipe([pick(["Name"])]),
    findDependencies: ({ live }) => [
      {
        type: "Function",
        group: "Lambda",
        ids: pipe([
          () => live,
          get("Content.mainSteps"),
          tap((params) => {
            assert(true);
          }),
          pluck("inputs"),
          tap((params) => {
            assert(true);
          }),
          pluck("FunctionName"),
          tap((params) => {
            assert(true);
          }),
        ])(),
      },
      {
        type: "Role",
        group: "IAM",
        ids: [pipe([() => live, get("Content.assumeRole")])()],
      },
    ],
    decorateList: ({ endpoint, getById }) =>
      pipe([
        tap((params) => {
          assert(getById);
          assert(endpoint);
        }),
      ]),
    decorate: ({ endpoint }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
      ]),
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    getByName: ({ getById }) => pipe([({ name }) => ({ Name: name }), getById]),
    tagResource: tagResource({ ResourceType: "Document" }),
    untagResource: untagResource({ ResourceType: "Document" }),
    configDefault: ({ name, namespace, properties: { Tags, ...otherProps } }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Name: name,
          Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        }),
      ])(),
  });
