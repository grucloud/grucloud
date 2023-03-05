const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, pluck, first } = require("rubico/x");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./CodeArtifactCommon");

const toDomain = ({ domainName, name, ...other }) => ({
  domain: domainName,
  repository: name,
  ...other,
});

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ domain, repository }) => {
    assert(repository);
    assert(domain);
  }),
  pick(["domain", "repository"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    toDomain,
    omitIfEmpty(["externalConnections", "upstreams"]),
    assignTags({ buildArn: buildArn({ config }), endpoint }),
  ]);

const associateExternalConnection =
  ({ endpoint, live }) =>
  ({ externalConnections, domain, repository, domainOwner }) =>
    pipe([
      tap((params) => {
        assert(endpoint);
        assert(domain);
        assert(repository);
      }),
      () => externalConnections,
      first,
      ({ externalConnectionName }) => ({
        externalConnection: externalConnectionName,
        domain,
        repository,
        domainOwner,
      }),
      tap((params) => {
        assert(true);
      }),
      endpoint().associateExternalConnection,
      tap((params) => {
        assert(true);
      }),
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeArtifact.html
exports.CodeArtifactRepository = () => ({
  type: "Repository",
  package: "codeartifact",
  client: "Codeartifact",
  propertiesDefault: {},
  omitProperties: [
    "domainOwner",
    "administratorAccount",
    "arn",
    "externalConnections[].packageFormat",
    "externalConnections[].status",
  ],
  inferName: () =>
    pipe([
      get("repository"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("repository"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("repository"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    domain: {
      type: "Domain",
      group: "CodeArtifact",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("domain"),
          tap((domain) => {
            assert(domain);
          }),
        ]),
    },
    upsteamRepositories: {
      type: "Repository",
      group: "CodeArtifact",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("upstreams"), pluck("repositoryName")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeArtifact.html#describeRepository-property
  getById: {
    method: "describeRepository",
    getField: "repository",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeArtifact.html#listRepositories-property
  getList: {
    method: "listRepositories",
    getParam: "repositories",
    decorate: ({ getById }) => pipe([toDomain, getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeArtifact.html#createRepository-property
  create: {
    method: "createRepository",
    pickCreated: ({ payload }) => pipe([get("repository"), toDomain]),
    postCreate:
      ({ endpoint, payload, created }) =>
      (live) =>
        pipe([
          () => payload,
          tap.if(
            get("externalConnections"),
            pipe([associateExternalConnection({ endpoint, live })])
          ),
        ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeArtifact.html#updateRepository-property
  update: {
    method: "updateRepository",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeArtifact.html#deleteRepository-property
  destroy: {
    method: "deleteRepository",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { domain },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(domain);
      }),
      () => otherProps,
      defaultsDeep({
        domain: domain.config.domain,
        tags: buildTags({
          name,
          config,
          namespace,
          UserTags: tags,
          key: "key",
          value: "value",
        }),
      }),
    ])(),
});
