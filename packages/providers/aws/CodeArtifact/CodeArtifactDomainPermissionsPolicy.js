const assert = require("assert");
const { pipe, tap, get, assign, eq, tryCatch, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { assignPolicyAccountAndRegion } = require("../IAM/IAMCommon");

const pickId = pipe([pick(["domain"])]);

const toPolicyDocument = ({ document, ...other }) => ({
  policyDocument: document,
  ...other,
});

const stringifyResourcePolicy = assign({
  policyDocument: pipe([get("policyDocument"), JSON.stringify]),
});

const parseResourcePolicy = assign({
  policyDocument: pipe([
    get("policyDocument"),
    tryCatch(JSON.parse, (error, payload) => payload),
  ]),
});

const decorate = ({ live }) =>
  pipe([
    tap((params) => {
      assert(live.domain);
    }),
    defaultsDeep({ domain: live.domain }),
    toPolicyDocument,
    parseResourcePolicy,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeArtifact.html
exports.CodeArtifactDomainPermissionsPolicy = () => ({
  type: "DomainPermissionsPolicy",
  package: "codeartifact",
  client: "Codeartifact",
  findName: () => pipe([get("domain")]),
  findId: () => pipe([get("domain")]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  inferName: ({ dependenciesSpec: { domain } }) =>
    pipe([
      tap((params) => {
        assert(domain);
      }),
      () => domain,
    ]),
  dependencies: {
    domain: {
      type: "Domain",
      group: "CodeArtifact",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("domain"),
          tap((domain) => {
            assert(domain);
          }),
        ]),
    },
  },
  omitProperties: ["domain", "resourceArn", "revision"],
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        policyDocument: pipe([
          get("policyDocument"),
          assignPolicyAccountAndRegion({ providerConfig, lives }),
        ]),
      }),
    ]),
  getById: {
    method: "getDomainPermissionsPolicy",
    pickId,
    decorate,
  },
  create: {
    method: "putDomainPermissionsPolicy",
    filterPayload: pipe([stringifyResourcePolicy]),
  },
  update: {
    method: "putDomainPermissionsPolicy",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, stringifyResourcePolicy])(),
  },
  destroy: {
    method: "deleteDomainPermissionsPolicy",
    pickId,
    isInstanceDown: pipe([eq(get("policyDocument"), undefined)]),
  },
  getByName: getByNameCore,
  configDefault: ({
    namespace,
    properties: { ...otherProps },
    dependencies: { domain },
  }) =>
    pipe([
      tap((params) => {
        assert(domain);
      }),
      () => otherProps,
      defaultsDeep({ domain: domain.config.domain }),
    ])(),
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Domain", group: "CodeArtifact" },
          pickKey: pipe([pickId]),
          method: "getDomainPermissionsPolicy",
          decorate: ({ lives, parent }) => pipe([decorate({ live: parent })]),
          config,
        }),
    ])(),
});
