const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./CodeArtifactCommon");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ domain }) => {
    assert(domain);
  }),
  pick(["domain"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeArtifact.html
exports.CodeArtifactDomain = () => ({
  type: "Domain",
  package: "codeartifact",
  client: "Codeartifact",
  propertiesDefault: {},
  omitProperties: [
    "status",
    "arn",
    "createdTime",
    "owner",
    "encryptionKey",
    "repositoryCount",
    "assetSizeBytes",
    "s3BucketArn",
  ],
  inferName: () =>
    pipe([
      get("domain"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("domain"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("arn"),
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
      dependencyId: ({ lives, config }) => get("encryptionKey"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeArtifact.html#describeDomain-property
  getById: {
    method: "describeDomain",
    getField: "domain",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeArtifact.html#listDomains-property
  getList: {
    method: "listDomains",
    getParam: "domains",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeArtifact.html#createDomain-property
  create: {
    method: "createDomain",
    pickCreated: ({ payload }) => pipe([get("domain")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeArtifact.html#updateDomain-property
  update: {
    method: "updateDomain",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeArtifact.html#deleteDomain-property
  destroy: {
    method: "deleteDomain",
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
    dependencies: { kmsKey },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTags({
          name,
          config,
          namespace,
          UserTags: tags,
          key: "key",
          value: "value",
        }),
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          encryptionKey: getField(kmsKey, "Arn"),
        })
      ),
    ])(),
});
