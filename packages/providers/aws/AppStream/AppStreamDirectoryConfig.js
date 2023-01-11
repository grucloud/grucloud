const assert = require("assert");
const { pipe, tap, get, pick, omit } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ DirectoryName }) => {
    assert(DirectoryName);
  }),
  pick(["DirectoryName"]),
]);

const decorate =
  ({ endpoint, config }) =>
  (live) =>
    pipe([
      tap((params) => {
        assert(endpoint);
      }),
      () => live,
      JSON.stringify,
      JSON.parse,
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html
exports.AppStreamDirectoryConfig = ({ compare }) => ({
  type: "DirectoryConfig",
  package: "appstream",
  client: "AppStream",
  propertiesDefault: {},
  inferName: () =>
    pipe([
      get("DirectoryName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("DirectoryName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("DirectoryName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  omitProperties: ["CreatedTime", "CertificateBasedAuthProperties"],
  dependencies: {
    certificateAuthority: {
      type: "CertificateAuthority",
      group: "ACMPCA",
      dependencyId: ({ lives, config }) =>
        pipe([get("CertificateBasedAuthProperties.CertificateAuthorityArn")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  environmentVariables: [
    {
      path: "ServiceAccountCredentials.AccountPassword",
      suffix: "ACCOUNT_PASSWORD",
    },
  ],
  compare: compare({
    filterAll: () =>
      pipe([omit(["ServiceAccountCredentials.AccountPassword"])]),
  }),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#describeDirectoryConfigs-property
  getById: {
    method: "describeDirectoryConfigs",
    getField: "DirectoryConfigs",
    pickId: pipe([
      tap(({ DirectoryName }) => {
        assert(DirectoryName);
      }),
      ({ DirectoryName }) => ({ DirectoryNames: [DirectoryName] }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#describeDirectoryConfigs-property
  getList: {
    method: "describeDirectoryConfigs",
    getParam: "DirectoryConfigs",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#createDirectoryConfig-property
  create: {
    method: "createDirectoryConfig",
    pickCreated: ({ payload }) => pipe([get("DirectoryConfig")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#updateDirectoryConfig-property
  update: {
    method: "updateDirectoryConfig",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#deleteDirectoryConfig-property
  destroy: {
    method: "deleteDirectoryConfig",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { certificateAuthority },
    config,
  }) =>
    pipe([
      () => otherProps,
      when(
        () => certificateAuthority,
        defaultsDeep({
          CertificateBasedAuthProperties: {
            CertificateAuthorityArn: getField(
              certificateAuthority,
              "CertificateAuthorityArn"
            ),
          },
        })
      ),
    ])(),
});
