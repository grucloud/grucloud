const assert = require("assert");
const { pipe, tap, get, eq, switchCase, assign } = require("rubico");
const { defaultsDeep, first, when, isEmpty } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./WorkSpacesCommon");

const buildArn = () =>
  pipe([
    get("WorkspaceId"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const assignArn = ({ config }) =>
  pipe([
    assign({
      Arn: pipe([
        tap(({ WorkspaceId }) => {
          assert(WorkspaceId);
        }),
        ({ WorkspaceId }) =>
          `arn:aws:workspaces:${
            config.region
          }:${config.accountId()}:workspace/${WorkspaceId}`,
      ]),
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
    assignArn({ config }),
  ]);

const filterPayload = (payload) => ({ Workspaces: [payload] });

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpaces.html
exports.WorkSpacesWorkspace = () => ({
  type: "Workspace",
  package: "workspaces",
  client: "WorkSpaces",
  propertiesDefault: {},
  omitProperties: [
    "Arn",
    "DirectoryId",
    "WorkspaceId",
    "VolumeEncryptionKey",
    "IpAddress",
    "State",
    "ErrorMessage",
    "ErrorCode",
    "ComputerName",
    "ModificationStates",
    "RelatedWorkspaces",
    "SubnetId",
  ],
  // TODO add directory name as prefix ?
  inferName: () =>
    pipe([
      get("UserName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("UserName"),
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
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    directory: {
      type: "Directory",
      group: "DirectoryService",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("DirectoryId"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      dependencyId: ({ lives, config }) => get("VolumeEncryptionKey"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpaces.html#describeWorkspaces-property
  getById: {
    method: "describeWorkspaces",
    getField: "Workspaces",
    pickId: pipe([
      tap(({ WorkspaceId }) => {
        assert(WorkspaceId);
      }),
      ({ WorkspaceId }) => ({
        WorkspaceIds: [WorkspaceId],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpaces.html#listWorkSpaces-property
  getList: {
    method: "describeWorkspaces",
    getParam: "Workspaces",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpaces.html#createWorkspaces-property
  create: {
    filterPayload,
    method: "createWorkspaces",
    pickCreated:
      ({ payload }) =>
      ({ FailedRequests = [], PendingRequests = [] }) =>
        pipe([
          () => FailedRequests,
          first,
          get("ErrorMessage"),
          switchCase([
            isEmpty,
            pipe([() => PendingRequests, first]),
            (message) => {
              const error = Error(message);
              error.message = message;
              throw error;
            },
          ]),
        ])(),
    isInstanceUp: pipe([eq(get("State"), "AVAILABLE")]),
    isInstanceError: pipe([eq(get("State"), "ERROR")]),
    getErrorMessage: get("ErrorMessage", "ERROR"),
    shouldRetryOnExceptionMessages: [
      "The specified directory could not be found in the specified region",
    ],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpaces.html#modifyWorkspaceProperties-property
  update: {
    method: "modifyWorkspaceProperties",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpaces.html#terminateWorkspaces-property
  destroy: {
    method: "terminateWorkspaces",
    pickId: pipe([
      tap(({ WorkspaceId }) => {
        assert(WorkspaceId);
      }),
      ({ WorkspaceId }) => ({
        TerminateWorkspaceRequests: [
          {
            WorkspaceId,
          },
        ],
      }),
    ]),
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
    dependencies: { directory, kmsKey },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(directory);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        DirectoryId: getField(directory, "DirectoryId"),
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          VolumeEncryptionKey: getField(kmsKey, "Arn"),
        })
      ),
    ])(),
});
