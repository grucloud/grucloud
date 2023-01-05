const assert = require("assert");
const { pipe, tap, get, pick, assign, eq } = require("rubico");
const { defaultsDeep, when, pluck } = require("rubico/x");

const { replaceAccountAndRegion } = require("../AwsCommon");
const { buildTags } = require("../AwsCommon");
const { assignTags, Tagger } = require("./SSMCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([pick(["Name"])]);

const buildArn = () => get("Name");

const assignArn = ({ config }) =>
  pipe([
    assign({
      Arn: pipe([
        tap(({ Name }) => {
          assert(true);
        }),
        ({ Name }) =>
          `arn:aws:ssm:${config.region}:${config.accountId()}:document/${Name}`,
      ]),
    }),
  ]);

const stringifyContent = assign({
  Content: pipe([get("Content"), JSON.stringify]),
});

const decorate =
  ({ endpoint, config }) =>
  (live) =>
    pipe([
      () => live,
      pickId,
      endpoint().getDocument,
      defaultsDeep(live),
      assign({ Content: pipe([get("Content"), JSON.parse]) }),
      assignArn({ config }),
      assignTags({ endpoint, ResourceType: "Document" }),
    ])();

exports.SSMDocument = () => ({
  package: "ssm",
  client: "SSM",
  type: "Document",
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () => get("Name"),
  findId: ({ config }) =>
    pipe([
      tap((params) => {
        assert(config);
      }),
      get("Arn"),
    ]),
  omitProperties: [
    "Arn",
    "Content.assumeRole",
    "Owner",
    "DocumentVersion",
    "CreatedDate",
    "Status",
    "StatusInformation",
    "ReviewStatus",
    "SchemaVersion",
    "Category",
    "CategoryEnum",
    "DefaultVersion",
    "Hash",
    "HashType",
    "LatestVersion",
    "Description",
  ],
  propertiesDefault: { DocumentFormat: "JSON" },
  dependencies: {
    role: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => get("Content.assumeRole"),
    },
    lambdaFunction: {
      type: "Function",
      group: "Lambda",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("Content.mainSteps"),
          pluck("inputs"),
          pluck("FunctionName"),
        ]),
    },
  },
  filterLive: ({ providerConfig, lives }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      assign({
        Name: pipe([
          get("Name"),
          replaceAccountAndRegion({
            providerConfig,
            lives,
          }),
        ]),
      }),
    ]),
  ignoreErrorCodes: ["InvalidDocument"],
  getById: {
    method: "describeDocument",
    getField: "Document",
    pickId,
    decorate,
  },
  getList: {
    method: "listDocuments",
    enhanceParams: () =>
      pipe([
        assign({
          Filters: () => [{ Key: "Owner", Values: ["Self"] }],
        }),
      ]),
    getParam: "DocumentIdentifiers",
    decorate:
      ({ getById }) =>
      (live) =>
        pipe([() => live, getById, defaultsDeep(live)])(),
  },
  create: {
    method: "createDocument",
    filterPayload: stringifyContent,
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    isInstanceUp: pipe([eq(get("Status"), "Active")]),
    isInstanceError: pipe([eq(get("Status"), "Failed")]),
    getErrorMessage: get("StatusInformation"),
  },
  destroy: { method: "deleteDocument", pickId },
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ Name: name }), getById({})]),
  update:
    ({ endpoint }) =>
    ({ payload, live }) =>
      pipe([
        tap((params) => {
          assert(live);
          assert(endpoint);
        }),
        () => payload,
        stringifyContent,
        defaultsDeep({
          DocumentVersion: live.LatestVersion,
        }),
        // TODO Ignore ErrCodeDuplicateDocumentContent
        // DefaultVersion  VS DocumentVersion VS LatestVersion
        endpoint().updateDocument,
        get("DocumentDescription"),
        pick(["Name", "DocumentVersion"]),
        endpoint().updateDocumentDefaultVersion,
      ])(),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn(config),
      additionalParams: pipe([() => ({ ResourceType: "Document" })]),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { iamRole },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => iamRole,
        defaultsDeep({
          Content: { assumeRole: getField(iamRole, "Arn") },
        })
      ),
    ])(),
});
