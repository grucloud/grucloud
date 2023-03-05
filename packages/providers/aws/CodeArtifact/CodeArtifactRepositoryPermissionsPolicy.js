const assert = require("assert");
const { pipe, tap, get, assign, eq, tryCatch, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { assignPolicyAccountAndRegion } = require("../IAM/AwsIamCommon");

const pickId = pipe([
  pick(["domain", "repository"]),
  tap(({ domain, repository }) => {
    assert(domain);
    assert(repository);
  }),
]);

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
exports.CodeArtifactRepositoryPermissionsPolicy = () => ({
  type: "RepositoryPermissionsPolicy",
  package: "codeartifact",
  client: "Codeartifact",
  findName: () => pipe([get("repository")]),
  findId: () => pipe([get("repository")]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  inferName: ({ dependenciesSpec: { domain } }) =>
    pipe([
      tap((params) => {
        assert(domain);
      }),
      () => domain,
    ]),
  dependencies: {
    repository: {
      type: "Repository",
      group: "CodeArtifact",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("repository"),
          tap((domain) => {
            assert(domain);
          }),
        ]),
    },
  },
  omitProperties: ["domain", "repository", "resourceArn", "revision"],
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
    method: "getRepositoryPermissionsPolicy",
    pickId,
    decorate,
  },
  create: {
    method: "putRepositoryPermissionsPolicy",
    filterPayload: pipe([stringifyResourcePolicy]),
  },
  update: {
    method: "putRepositoryPermissionsPolicy",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, stringifyResourcePolicy])(),
  },
  destroy: {
    method: "deleteRepositoryPermissionsPolicy",
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
          parent: { type: "Repository", group: "CodeArtifact" },
          pickKey: pipe([pickId]),
          method: "getRepositoryPermissionsPolicy",
          decorate: ({ lives, parent }) => pipe([decorate({ live: parent })]),
          config,
        }),
    ])(),
});
