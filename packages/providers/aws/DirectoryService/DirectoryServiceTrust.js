const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ TrustId }) => {
    assert(TrustId);
  }),
  pick(["TrustId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectoryService.html
exports.DirectoryServiceTrust = () => ({
  type: "Trust",
  package: "directory-service",
  client: "DirectoryService",
  propertiesDefault: {},
  omitProperties: ["TrustId"],
  inferName: () =>
    pipe([
      get("RemoteDomainName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("RemoteDomainName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("RemoteDomainName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["EntityDoesNotExistException"],
  environmentVariables: [
    {
      path: "TrustPassword",
      suffix: "TRUST_PASSWORD",
    },
  ],
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectoryService.html#describeTrusts-property
  getById: {
    method: "describeTrusts",
    getField: "Trusts",
    pickId: pipe([
      tap(({ TrustId }) => {
        assert(TrustId);
      }),
      ({ TrustId, DirectoryId }) => ({ TrustIds: [TrustId], DirectoryId }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectoryService.html#describeTrusts-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Directory", group: "DirectoryService" },
          pickKey: pipe([pick(["DirectoryId"])]),
          method: "describeTrusts",
          getParam: "Trusts",
          config,
          decorate,
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectoryService.html#createTrust-property
  create: {
    method: "createTrust",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectoryService.html#updateTrust-property
  update: {
    method: "updateTrust",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectoryService.html#deleteTrust-property
  destroy: {
    method: "deleteTrust",
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
      tap((id) => {
        assert(directory);
      }),
      () => otherProps,
      defaultsDeep({ DirectoryId: getField(directory, "DirectoryId") }),
    ])(),
});
