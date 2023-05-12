const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./RolesAnywhereCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const buildArn = () =>
  pipe([
    get("crlArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ crlId }) => {
    assert(crlId);
  }),
  pick(["crlId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RolesAnywhere.html
exports.RolesAnywhereCrl = () => ({
  type: "CRL",
  package: "rolesanywhere",
  client: "RolesAnywhere",
  propertiesDefault: {},
  omitProperties: [
    "crlId",
    "crlArn",
    "createdAt",
    "updatedAt",
    "trustAnchorArn",
  ],
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
      get("crlArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    trustAnchor: {
      type: "TrustAnchor",
      group: "RolesAnywhere",
      pathId: "trustAnchorArn",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("trustAnchorArn"),
          tap((trustAnchorArn) => {
            assert(trustAnchorArn);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RolesAnywhere.html#getCrl-property
  getById: {
    method: "getCrl",
    getField: "crl",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RolesAnywhere.html#listCrls-property
  getList: {
    method: "listCrls",
    getParam: "crls",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RolesAnywhere.html#createCrl-property
  create: {
    method: "importCrl",
    pickCreated: ({ payload }) => pipe([get("crl")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RolesAnywhere.html#importCrl-property
  update: {
    method: "updateCrl",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RolesAnywhere.html#deleteCrl-property
  destroy: {
    method: "deleteCrl",
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
    dependencies: { trustAnchor },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        trustAnchorArn: getField(trustAnchor, "arn"),
        tags: buildTags({
          name,
          config,
          namespace,
          UserTags: tags,
          key: "key",
          value: "value",
        }),
      }),
    ])(),
});
