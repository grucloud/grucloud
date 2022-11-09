const assert = require("assert");
const { pipe, tap, get, pick, assign, eq } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource, assignTags } = require("./SSMCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([pick(["Name"])]);

const stringifyContent = assign({
  Content: pipe([get("Content"), JSON.stringify]),
});

const decorate =
  ({ endpoint }) =>
  (live) =>
    pipe([
      () => live,
      pickId,
      endpoint().getDocument,
      defaultsDeep(live),
      assign({ Content: pipe([get("Content"), JSON.parse]) }),
      assignTags({ endpoint, ResourceType: "Document" }),
    ])();

const model = ({ config }) => ({
  package: "ssm",
  client: "SSM",
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
  // update: {
  //   method: "updateDocument",
  //   filterParams: ({ payload, live }) =>
  //     pipe([
  //       () => payload,
  //       stringifyContent,
  //       defaultsDeep({
  //         DocumentVersion: live.DefaultVersion,
  //       }),
  //     ])(),
  // },
  destroy: { method: "deleteDocument", pickId },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html
exports.SSMDocument = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: get("live.Name"),
    findId: pipe([
      get("live.Name"),
      (Name) =>
        `arn:aws:ssm:${config.region}:${config.accountId()}:document/${Name}`,
    ]),
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
    tagResource: tagResource({ ResourceType: "Document" }),
    untagResource: untagResource({ ResourceType: "Document" }),
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { iamRole },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Name: name,
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
