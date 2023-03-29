const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  assign,
  fork,
  switchCase,
} = require("rubico");
const { defaultsDeep, isIn, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./CodeGuruReviewerCommon");

const buildArn = () =>
  pipe([
    get("AssociationArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ AssociationArn }) => {
    assert(AssociationArn);
  }),
  pick(["AssociationArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn({ config }), endpoint }),
    assign({
      Repository: switchCase([
        eq(get("ProviderType"), "CodeCommit"),
        fork({ CodeCommit: pick(["Name"]) }),
        eq(get("ProviderType"), "GitHub"),
        fork({
          GitHubEnterpriseServer: pick(["ConnectionArn", "Name", "Owner"]),
        }),
        eq(get("ProviderType"), "Bitbucket"),
        fork({ Bitbucket: pick(["ConnectionArn", "Name", "Owner"]) }),
        eq(get("ProviderType"), "GitHubEnterpriseServer"),
        fork({
          GitHubEnterpriseServer: pick(["ConnectionArn", "Name", "Owner"]),
        }),
        eq(get("ProviderType"), "S3Bucket"),
        fork({
          S3Bucket: fork({
            Name: get("Name"),
            BucketName: get("S3RepositoryDetails.BucketName"),
          }),
        }),
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeGuruReviewer.html
exports.CodeGuruReviewerRepositoryAssociation = () => ({
  type: "RepositoryAssociation",
  package: "codeguru-reviewer",
  client: "CodeGuruReviewer",
  propertiesDefault: {
    KMSKeyDetails: {
      EncryptionOption: "AWS_OWNED_CMK",
    },
  },
  omitProperties: [
    "AssociationArn",
    "AssociationId",
    "ConnectionArn",
    "Owner",
    "State",
    "StateReason",
    "LastUpdatedTimeStamp",
    "CreatedTimeStamp",
    "KMSKeyDetails.KMSKeyId",
    "ProviderType",
  ],
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
      get("AssociationArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["NotFoundException"],
  dependencies: {
    bitbucketConnection: {
      type: "Connection",
      group: "CodeStarConnections",
      dependencyId: ({ lives, config }) =>
        pipe([get("Repository.Bitbucket.ConnectionArn")]),
    },
    codeCommitRepository: {
      type: "Repository",
      group: "CodeCommit",
      dependencyId: ({ lives, config }) =>
        pipe([get("Repository.CodeCommit.Name")]),
    },
    gitHubEnterpriseServerConnection: {
      type: "Connection",
      group: "CodeStarConnections",
      dependencyId: ({ lives, config }) =>
        pipe([get("Repository.GitHubEnterpriseServer.ConnectionArn")]),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("KMSKeyDetails.KMSKeyId"),
    },
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([get("Repository.S3Bucket.BucketName")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeGuruReviewer.html#getRepositoryAssociation-property
  getById: {
    method: "describeRepositoryAssociation",
    getField: "RepositoryAssociation",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeGuruReviewer.html#listRepositoryAssociations-property
  getList: {
    method: "listRepositoryAssociations",
    getParam: "RepositoryAssociationSummaries",
    decorate: ({ getById }) =>
      pipe([
        tap((name) => {
          assert(name);
        }),
        getById,
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeGuruReviewer.html#associateRepository-property
  create: {
    method: "associateRepository",
    pickCreated: ({ payload }) => pipe([get("RepositoryAssociation")]),
    isInstanceUp: pipe([get("State"), isIn(["Associated"])]),
    isInstanceError: pipe([get("State"), isIn(["Failed"])]),
    getErrorMessage: pipe([get("StateReason", "Failed")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeGuruReviewer.html#updateRepositoryAssociation-property
  update: {
    method: "updateRepositoryAssociation",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeGuruReviewer.html#disassociateRepository-property
  destroy: {
    method: "disassociateRepository",
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
    properties: { Tags, ...otherProps },
    dependencies: {
      bitbucketConnection,
      gitHubEnterpriseServerConnection,
      kmsKey,
    },
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
          KMSKeyDetails: { KMSKeyId: getField(kmsKey, "Arn") },
        })
      ),
      when(
        () => bitbucketConnection,
        defaultsDeep({
          Repository: {
            Bitbucket: {
              ConnectionArn: getField(bitbucketConnection, "ConnectionArn"),
            },
          },
        })
      ),
      when(
        () => gitHubEnterpriseServerConnection,
        defaultsDeep({
          Repository: {
            GitHubEnterpriseServer: {
              ConnectionArn: getField(
                gitHubEnterpriseServerConnection,
                "ConnectionArn"
              ),
            },
          },
        })
      ),
    ])(),
});
