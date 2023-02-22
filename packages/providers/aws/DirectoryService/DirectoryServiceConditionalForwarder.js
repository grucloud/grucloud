const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, append } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ DirectoryId, RemoteDomainName }) => {
    assert(DirectoryId);
    assert(RemoteDomainName);
  }),
  pick(["DirectoryId", "RemoteDomainName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectoryService.html
exports.DirectoryServiceConditionalForwarder = () => ({
  type: "ConditionalForwarder",
  package: "directory-service",
  client: "DirectoryService",
  propertiesDefault: {},
  omitProperties: ["DirectoryId", "ReplicationScope"],
  inferName:
    ({ dependenciesSpec: { directory } }) =>
    ({ RemoteDomainName }) =>
      pipe([
        tap((params) => {
          assert(directory);
          assert(RemoteDomainName);
        }),
        () => `${directory}::${RemoteDomainName}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ RemoteDomainName, DirectoryId }) =>
      pipe([
        tap((name) => {
          assert(RemoteDomainName);
          assert(DirectoryId);
        }),
        () => DirectoryId,
        lives.getById({
          type: "Directory",
          group: "DirectoryService",
          providerName: config.providerName,
        }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
        append(`::${RemoteDomainName}`),
      ])(),

  findId: () =>
    pipe([
      get("DirectoryId"),
      tap((id) => {
        assert(id);
      }),
    ]),
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
  },
  ignoreErrorCodes: [
    "EntityDoesNotExistException",
    "ResourceNotFoundException",
  ],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectoryService.html#describeConditionalForwarders-property
  getById: {
    method: "describeConditionalForwarders",
    getField: "ConditionalForwarders",
    pickId: pipe([
      pickId,
      ({ DirectoryId, RemoteDomainName }) => ({
        DirectoryId,
        RemoteDomainNames: [RemoteDomainName],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectoryService.html#describeConditionalForwarders-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Directory", group: "DirectoryService" },
          pickKey: pipe([
            pick(["DirectoryId"]),
            tap(({ DirectoryId }) => {
              assert(DirectoryId);
            }),
          ]),
          method: "describeConditionalForwarders",
          getParam: "ConditionalForwarders",
          config,
          decorate,
        }),
    ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectoryService.html#createConditionalForwarder-property
  create: {
    method: "createConditionalForwarder",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectoryService.html#updateConditionalForwarder-property
  update: {
    method: "updateConditionalForwarder",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectoryService.html#deleteConditionalForwarder-property
  destroy: {
    method: "deleteConditionalForwarder",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { directory },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(directory);
      }),
      () => otherProps,
      defaultsDeep({ DirectoryId: getField(directory, "DirectoryId") }),
    ])(),
});
