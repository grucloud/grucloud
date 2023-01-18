const assert = require("assert");
const { map, pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const {
  imageDescriptionFromId,
  fetchImageIdFromDescription,
} = require("../EC2/EC2Common");

const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ Engine, EngineVersion }) => {
    assert(Engine);
    assert(EngineVersion);
  }),
  pick(["Engine", "EngineVersion"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    when(
      get("Manifest"),
      assign({ Manifest: pipe([get("Manifest"), JSON.parse]) })
    ),
    when(
      get("Image.ImageId"),
      assign({
        Image: pipe([
          get("Image"),
          assign({
            Description: pipe([imageDescriptionFromId({ config })]),
          }),
        ]),
      })
    ),
  ]);

const filterPayload = assign({
  Manifest: pipe([get("Manifest"), JSON.stringify]),
});

const findName =
  () =>
  ({ Engine, EngineVersion }) =>
    `${Engine}::${EngineVersion}`;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html
exports.RDSDBEngineVersion = () => ({
  type: "DBEngineVersion",
  package: "rds",
  client: "RDS",
  ignoreErrorCodes: [
    "CustomDBEngineVersionNotFoundFault",
    "InvalidParameterValue",
  ],
  inferName: findName,
  findName,
  findId: findName,
  omitProperties: ["KMSKeyId", "ImageId"],
  dependencies: {
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("KMSKeyId"),
    },
    s3BucketDatabaseInstallationFiles: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([get("DatabaseInstallationFilesS3BucketName")]),
    },
  },
  getById: {
    method: "describeDBEngineVersions",
    pickId,
    getField: "DBEngineVersions",
    decorate,
  },
  getList: {
    filterResource: pipe([get("Image")]),
    method: "describeDBEngineVersions",
    getParam: "DBEngineVersions",
    decorate,
  },
  create: {
    filterPayload,
    method: "createCustomDBEngineVersion",
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
  },
  update: { method: "modifyCustomDBEngineVersion" },
  destroy: { method: "deleteCustomDBEngineVersion", pickId },
  getByName: getByNameCore,
  // TODO
  //   tagger: ({ config }) =>
  //     Tagger({
  //       buildArn: buildArn({ config }),
  //     }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, Image, ...otherProps },
    dependencies: { kmsKey },
    config,
    endpoint,
  }) =>
    pipe([
      () => Image,
      fetchImageIdFromDescription({ config }),
      (ImageId) =>
        pipe([
          () => otherProps,
          defaultsDeep({
            Tags: buildTags({ name, config, namespace, UserTags: Tags }),
            ImageId,
          }),
          when(
            () => kmsKey,
            defaultsDeep({
              KMSKeyId: getField(kmsKey, "Arn"),
            })
          ),
        ])(),
    ])(),
});
