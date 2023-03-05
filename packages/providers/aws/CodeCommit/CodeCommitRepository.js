const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./CodeCommitCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ repositoryName }) => {
    assert(repositoryName);
  }),
  pick(["repositoryName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([assignTags({ buildArn: buildArn(), endpoint })]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCommit.html
exports.CodeCommitRepository = () => ({
  type: "Repository",
  package: "codecommit",
  client: "CodeCommit",
  propertiesDefault: {},
  omitProperties: [
    "accountId",
    "repositoryId",
    "lastModifiedDate",
    "creationDate",
    "cloneUrlHttp",
    "cloneUrlSsh",
    "Arn",
  ],
  inferName: () =>
    pipe([
      get("repositoryName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("repositoryName"),
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
  ignoreErrorCodes: ["RepositoryDoesNotExistException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCommit.html#getRepository-property
  getById: {
    method: "getRepository",
    getField: "repositoryMetadata",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCommit.html#listRepositories-property
  getList: {
    method: "listRepositories",
    getParam: "repositories",
    decorate: ({ getById }) => pipe([getById]),
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCommit.html#createRepository-property
  create: {
    method: "createRepository",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCommit.html#updateRepository-property
  //   update: {
  //     method: "updateRepository",
  //     filterParams: ({ payload, diff, live }) =>
  //       pipe([() => payload, defaultsDeep(pickId(live))])(),
  //   },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCommit.html#deleteRepository-property
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
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
    ])(),
});
