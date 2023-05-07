const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, when, identity, last, callProp } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./AppIntegrationsCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ Id }) => {
    assert(Id);
  }),
  ({ Id }) => ({ Identifier: Id }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const arnToId = pipe([callProp("split", `/`), last]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppIntegrations.html
exports.AppIntegrationsDataIntegration = () => ({
  type: "DataIntegration",
  package: "appintegrations",
  client: "AppIntegrations",
  propertiesDefault: {},
  omitProperties: ["Arn"],
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("Arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("KmsKey"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppIntegrations.html#getDataIntegration-property
  getById: {
    method: "getDataIntegration",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppIntegrations.html#listDataIntegrations-property
  getList: {
    method: "listDataIntegrations",
    getParam: "DataIntegrations",
    decorate: ({ getById }) =>
      pipe([get("Arn"), arnToId, (Id) => ({ Id }), getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppIntegrations.html#createDataIntegration-property
  create: {
    method: "createDataIntegration",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppIntegrations.html#updateDataIntegration-property
  update: {
    method: "updateDataIntegration",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppIntegrations.html#deleteDataIntegration-property
  destroy: {
    method: "deleteDataIntegration",
    pickId: pipe([
      tap(({ Id }) => {
        assert(Id);
      }),
      ({ Id }) => ({ DataIntegrationIdentifier: Id }),
    ]),
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
    dependencies: { kmsKey },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          KmsKey: getField(kmsKey, "Arn"),
        })
      ),
    ])(),
});
