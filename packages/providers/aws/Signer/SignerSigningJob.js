const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity, isIn } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ jobId }) => {
    assert(jobId);
  }),
  pick(["jobId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Signer.html
exports.SignerSigningJob = () => ({
  type: "SigningJob",
  package: "signer",
  client: "Signer",
  propertiesDefault: {},
  omitProperties: [
    "jobId",
    "platformId",
    "createdAt",
    "completedAt",
    "signatureExpiresAt",
    "requestedBy",
    "revocationRecord",
    "status",
    "statusReason",
    "jobOwner",
    "jobInvoker",
    "signingMaterial",
    "profileVersion",
    "profileName",
  ],
  inferName:
    ({ dependenciesSpec: { signingProfile } }) =>
    ({ source }) =>
      pipe([
        tap((params) => {
          assert(signingProfile);
        }),
        () => `${signingProfile}::${source.s3.bucketName}::${source.s3.key}`,
      ])(),
  findName:
    () =>
    ({ profileName, source }) =>
      pipe([
        () => `${profileName}::${source.s3.bucketName}::${source.s3.key}`,
      ])(),
  findId: () =>
    pipe([
      get("jobId"),
      tap((id) => {
        assert(id);
      }),
    ]),

  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    signingProfile: {
      type: "SigningProfile",
      group: "Signer",
      dependencyId: () => pipe([get("profileName")]),
    },
    s3BucketSource: {
      type: "Bucket",
      group: "S3",
      dependencyId: () => pipe([get("source.s3.bucketName")]),
    },
    s3BucketDestination: {
      type: "Bucket",
      group: "S3",
      dependencyId: () => pipe([get("destination.s3.bucketName")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Signer.html#describeSigningJob-property
  getById: {
    method: "describeSigningJob",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Signer.html#listSigningJobs-property
  getList: {
    method: "listSigningJobs",
    getParam: "jobs",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Signer.html#startSigningJob-property
  create: {
    method: "startSigningJob",
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: pipe([get("status"), isIn(["Succeeded"])]),
    isInstanceError: pipe([get("status"), isIn(["Failed"])]),
    getErrorMessage: pipe([get("statusReason", "Failed")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Signer.html#updateSigningJob-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Signer.html#deleteSigningJob-property
  destroy: {
    method: "revokeSignature",
    pickId: pipe([pickId, defaultsDeep({ reason: "revoked by GruCloud" })]),
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { signingProfile },
    config,
  }) =>
    pipe([
      tap((id) => {
        assert(signingProfile);
      }),
      () => otherProps,
      defaultsDeep({ profileName: signingProfile.config.profileName }),
    ])(),
});
