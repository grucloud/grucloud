const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, when, first, callProp } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { findNameInTagsOrId } = require("../AwsCommon");

const { Tagger } = require("./FSxCommon");

const buildArn = () =>
  pipe([
    get("ResourceARN"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ AssociationId }) => {
    assert(AssociationId);
  }),
  pick(["AssociationId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const findId = () =>
  pipe([
    get("AssociationId"),
    tap((id) => {
      assert(id);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html
exports.FSxDataRepositoryAssociation = () => ({
  type: "DataRepositoryAssociation",
  package: "fsx",
  client: "FSx",
  propertiesDefault: {},
  omitProperties: [
    "AssociationId",
    "ResourceARN",
    "FileSystemId",
    "OwnerId",
    "CreationTime",
    "Lifecycle",
    "FailureDetails",
    "ResourceARN",
    "FileCacheId",
  ],
  findName: findNameInTagsOrId({ findId }),
  findId,
  dependencies: {
    fileSystem: {
      type: "FileSystem",
      group: "FSx",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("FileSystemId"),
          tap((FileSystemId) => {
            assert(FileSystemId);
          }),
        ]),
    },
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("DataRepositoryPath"),
          callProp("replace", "s3://"),
          callProp("spit", "/"),
          first,
          tap((params) => {
            assert(true);
          }),
        ]),
    },
  },
  ignoreErrorCodes: ["DataRepositoryAssociationNotFound"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#describeDataRepositoryAssociations-property
  getById: {
    method: "describeDataRepositoryAssociations",
    getField: "DataRepositoryAssociations",
    pickId: pipe([
      tap(({ AssociationId }) => {
        assert(AssociationId);
      }),
      ({ AssociationId }) => ({
        AssociationIds: [AssociationId],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#describeDataRepositoryAssociations-property
  getList: {
    method: "describeDataRepositoryAssociations",
    getParam: "Associations",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#createDataRepositoryAssociation-property
  create: {
    method: "createDataRepositoryAssociation",
    pickCreated: ({ payload }) => pipe([get("Association")]),
    configIsUp: { retryCount: 45 * 12, retryDelay: 5e3 },
    isInstanceUp: pipe([
      tap(({ Lifecycle }) => {
        assert(Lifecycle);
      }),
      eq(get("Lifecycle"), "AVAILABLE"),
    ]),
    isInstanceError: pipe([eq(get("Lifecycle"), "FAILED")]),
    getErrorMessage: get("FailureDetails.Message", "error"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#updateDataRepositoryAssociation-property
  update: {
    method: "updateDataRepositoryAssociation",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#deleteDataRepositoryAssociation-property
  destroy: {
    method: "deleteDataRepositoryAssociation",
    //TODO  DeleteDataInFileSystem ?
    pickId,
    shouldRetryOnExceptionMessages: [],
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
    dependencies: { fileSystem },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => fileSystem,
        defaultsDeep({
          FileSystemId: getField(fileSystem, "FileSystemId"),
        })
      ),
    ])(),
});
