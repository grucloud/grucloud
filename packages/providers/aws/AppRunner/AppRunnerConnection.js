const assert = require("assert");
const { pipe, tap, get, pick, eq, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { buildTags } = require("../AwsCommon");
const { Tagger, assignTags } = require("./AppRunnerCommon");

const buildArn = () => get("ConnectionArn");
const pickId = pipe([pick(["ConnectionArn"])]);

const decorate = ({ endpoint }) =>
  pipe([assignTags({ endpoint, buildArn: buildArn() })]);

exports.AppRunnerConnection = ({ compare }) => ({
  type: "Connection",
  package: "apprunner",
  client: "AppRunner",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  inferName: () => get("ConnectionName"),
  findName: () => pipe([get("ConnectionName")]),
  findId: () => pipe([get("ConnectionArn")]),
  omitProperties: ["ConnectionArn", "Status", "CreatedAt"],
  filterLive: () => pipe([pick(["ConnectionName", "ProviderType"])]),
  getById: {
    method: "listConnections",
    pickId: pipe([
      pick(["ConnectionName"]),
      tap(({ ConnectionName }) => {
        assert(ConnectionName);
      }),
    ]),
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
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ ConnectionName: name }), getById({})]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies,
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, namespace, config, UserTags: Tags }),
      }),
    ])(),
});
