const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./SSMCommon");

const model = {
  package: "ssm",
  client: "SSM",
  pickIds: ["Name"],
  ignoreErrorCodes: ["ParameterNotFound"],
  getById: { method: "getParameter", getField: "Parameter" },
  getList: { method: "describeParameters", getParam: "Parameters" },
  create: { method: "putParameter" },
  update: { method: "putParameter", extraParam: { Overwrite: true } },
  destroy: { method: "deleteParameter" },
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html
exports.SSMParameter = ({ spec, config }) =>
  createAwsResource({
    model,
    spec,
    config,
    findName: get("live.Name"),
    findId: get("live.Name"),
    findDependencies: ({ live }) => [
      {
        type: "Key",
        group: "KMS",
        ids: [live.KeyId],
      },
    ],
    decorate: ({ endpoint }) =>
      pipe([
        assign({
          Tags: pipe([
            ({ Name }) =>
              endpoint().listTagsForResource({
                ResourceId: Name,
                ResourceType: "Parameter",
              }),
            get("TagList"),
          ]),
        }),
      ]),
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    getByName: ({ getById }) => pipe([({ name }) => ({ Name: name }), getById]),
    tagResource: tagResource({ ResourceType: "Parameter" }),
    untagResource: untagResource({ ResourceType: "Parameter" }),
    configDefault: ({ name, namespace, properties: { Tags, ...otherProps } }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Name: name,
          Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        }),
      ])(),
  });
