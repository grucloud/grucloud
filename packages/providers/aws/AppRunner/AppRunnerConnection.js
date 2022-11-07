const assert = require("assert");
const { pipe, tap, get, pick, eq, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { buildTags } = require("../AwsCommon");
const { tagResource, untagResource, assignTags } = require("./AppRunnerCommon");

const { createAwsResource } = require("../AwsClient");

const buildArn = () => get("ConnectionArn");
const pickId = pipe([pick(["ConnectionArn"])]);

const decorate = ({ endpoint }) =>
  pipe([assignTags({ endpoint, buildArn: buildArn() })]);

const model = ({ config }) => ({
  package: "apprunner",
  client: "AppRunner",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  getById: {
    method: "listConnections",
    pickId: pick(["ConnectionName"]),
    getField: "ConnectionSummaryList",
    decorate,
  },
  getList: {
    method: "listConnections",
    getParam: "ConnectionSummaryList",
    decorate,
  },
  create: {
    method: "createConnection",
    pickCreated: ({ payload }) => pipe([get("Connection")]),
    isInstanceUp: pipe([eq(get("Status"), "AVAILABLE")]),
    isInstanceError: pipe([eq(get("Status"), "FAILED_CREATION")]),
  },
  destroy: {
    method: "deleteConnection",
    pickId,
  },
});

exports.AppRunnerConnection = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.ConnectionName")]),
    findId: pipe([get("live.ConnectionArn")]),
    getByName: ({ getById }) =>
      pipe([({ name }) => ({ ConnectionName: name }), getById]),
    tagResource: tagResource({
      buildArn: buildArn(config),
    }),
    untagResource: untagResource({
      buildArn: buildArn(config),
    }),
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies,
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Tags: buildTags({ name, namespace, config, UserTags: Tags }),
        }),
      ])(),
  });
