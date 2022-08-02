const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./SSMCommon");

const pickId = pipe([pick(["Name"])]);

const model = ({ config }) => ({
  package: "ssm",
  client: "SSM",
  ignoreErrorCodes: ["InvalidDocument"],
  getById: {
    method: "describeDocument",
    getField: "Document",
    pickId,
  },
  getList: {
    method: "listDocuments",
    enhanceParams: () =>
      pipe([
        assign({
          Filters: () => [{ Key: "Owner", Values: ["Self"] }],
        }),
      ]),
    getParam: "DocumentIdentifiers",
  },
  create: {
    method: "createDocument",
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
  },
  update: { method: "updateDocument" },
  destroy: { method: "deleteDocument", pickId },
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
