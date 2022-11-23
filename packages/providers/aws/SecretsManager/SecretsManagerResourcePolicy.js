const assert = require("assert");
const { pipe, tap, get, assign, eq, tryCatch, omit } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { compareAws, assignPolicyAccountAndRegion } = require("../AwsCommon");

const compare = compareAws({});

const pickId = pipe([({ Name }) => ({ SecretId: Name })]);

const stringifyResourcePolicy = assign({
  ResourcePolicy: pipe([get("ResourcePolicy"), JSON.stringify]),
});

const parseResourcePolicy = assign({
  ResourcePolicy: pipe([
    get("ResourcePolicy"),
    tryCatch(JSON.parse, (error, payload) => payload),
  ]),
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecretsManager.html
exports.SecretsManagerResourcePolicy = () => ({
  type: "ResourcePolicy",
  package: "secrets-manager",
  client: "SecretsManager",
  findName: () => pipe([get("Name")]),
  findId: () => pipe([get("ARN")]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  inferName: get("dependenciesSpec.secret"),
  dependencies: {
    secret: {
      type: "Secret",
      group: "SecretsManager",
      parent: true,
      dependencyId: ({ lives, config }) => get("ARN"),
    },
  },
  omitProperties: ["ARN", "Name"],
  compare: compare({
    filterAll: () => pipe([omit(["SecretId", "Name"])]),
  }),
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        ResourcePolicy: pipe([
          get("ResourcePolicy"),
          assignPolicyAccountAndRegion({ providerConfig, lives }),
        ]),
      }),
    ]),
  getById: {
    method: "getResourcePolicy",
    pickId,
    decorate: () => pipe([parseResourcePolicy]),
  },
  create: {
    method: "putResourcePolicy",
    filterPayload: pipe([stringifyResourcePolicy]),
  },
  update: {
    method: "putResourcePolicy",
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([
        () => payload,
        stringifyResourcePolicy,
        assign({
          SecretId: () => live.ARN,
        }),
      ])(),
  },
  destroy: {
    method: "deleteResourcePolicy",
    pickId,
    isInstanceDown: pipe([eq(get("ResourcePolicy"), undefined)]),
  },
  getByName: getByNameCore,
  configDefault: ({
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { secret },
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({ SecretId: getField(secret, "ARN") }),
    ])(),
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Secret", group: "SecretsManager" },
          pickKey: pipe([({ Name }) => ({ SecretId: Name })]),
          method: "getResourcePolicy",
          decorate: ({ lives, parent: { Name } }) =>
            pipe([
              assign({
                ResourcePolicy: pipe([get("ResourcePolicy"), JSON.parse]),
              }),
            ]),
          config,
        }),
    ])(),
});
