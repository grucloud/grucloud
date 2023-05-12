const assert = require("assert");
const { pipe, tap, get, pick, set } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./RolesAnywhereCommon");

const buildArn = () =>
  pipe([
    get("trustAnchorArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ trustAnchorId }) => {
    assert(trustAnchorId);
  }),
  pick(["trustAnchorId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RolesAnywhere.html
exports.RolesAnywhereTrustAnchor = () => ({
  type: "TrustAnchor",
  package: "rolesanywhere",
  client: "RolesAnywhere",
  propertiesDefault: {},
  omitProperties: ["trustAnchorId", "createdAt", "trustAnchorArn", "updatedAt"],
  inferName: () =>
    pipe([
      get("name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("trustAnchorId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    certificateAuthority: {
      type: "CertificateAuthority",
      group: "ACMPCA",
      pathId: "source.sourceData.acmPcaArn",
      dependencyId: ({ lives, config }) =>
        pipe([get("source.sourceData.acmPcaArn")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RolesAnywhere.html#getTrustAnchor-property
  getById: {
    method: "getTrustAnchor",
    getField: "trustAnchor",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RolesAnywhere.html#listTrustAnchors-property
  getList: {
    method: "listTrustAnchors",
    getParam: "trustAnchors",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RolesAnywhere.html#createTrustAnchor-property
  create: {
    method: "createTrustAnchor",
    pickCreated: ({ payload }) => pipe([get("trustAnchor")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RolesAnywhere.html#updateTrustAnchor-property
  // TODO enableTrustAnchor disableTrustAnchor
  update: {
    method: "updateTrustAnchor",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RolesAnywhere.html#deleteTrustAnchor-property
  destroy: {
    // TODO disableTrustAnchor
    method: "deleteTrustAnchor",
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
    properties: { tags, ...otherProps },
    dependencies: { certificateAuthority },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTags({
          name,
          config,
          namespace,
          UserTags: tags,
          key: "key",
          value: "value",
        }),
      }),
      when(
        () => certificateAuthority,
        set(
          "source.sourceData.acmPcaArn",
          getField(certificateAuthority, "CertificateAuthorityArn")
        )
      ),
    ])(),
});
