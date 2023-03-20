const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, identity, pluck } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags, disassociate } = require("./WorkSpacesWebCommon");

const buildArn = () =>
  pipe([
    get("trustStoreArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ trustStoreArn }) => {
    assert(trustStoreArn);
  }),
  pick(["trustStoreArn"]),
]);

const filterPayload = pipe([
  assign({ certificateList: pipe([get("certificateList"), pluck("body")]) }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
    assign({
      certificateList: pipe([
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#listTrustStoreCertificates-property
        pickId,
        endpoint().listTrustStoreCertificates,
        ({ trustStoreArn, certificateList }) =>
          pipe([
            () => certificateList,
            map(
              pipe([
                // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#getTrustStoreCertificate-property
                pick(["thumbprint"]),
                defaultsDeep({ trustStoreArn }),
                endpoint().getTrustStoreCertificate,
                get("certificate"),
              ])
            ),
          ])(),
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html
exports.WorkSpacesWebTrustStore = () => ({
  type: "TrustStore",
  package: "workspaces-web",
  client: "WorkSpacesWeb",
  propertiesDefault: {},
  omitProperties: ["trustStoreArn", "associatedPortalArns"],
  // TODO
  inferName:
    ({}) =>
    ({}) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => "default",
      ])(),
  // TODO
  findName:
    ({ lives, config }) =>
    ({}) =>
      pipe([
        tap(() => {
          assert(true);
        }),
        () => "default",
      ])(),
  findId: () =>
    pipe([
      get("trustStoreArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    portals: {
      type: "Portal",
      group: "WorkSpacesWeb",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("associatedPortalArns")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#getTrustStore-property
  getById: {
    method: "getTrustStore",
    getField: "trustStore",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#listTrustStores-property
  getList: {
    method: "listTrustStores",
    getParam: "trustStores",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#createTrustStore-property
  create: {
    filterPayload,
    method: "createTrustStore",
    pickCreated: ({ payload }) => pipe([identity]),
    postCreate: ({ endpoint, resolvedDependencies: { portals } }) =>
      pipe([
        associate({
          endpoint,
          portals,
          method: "associateTrustStore",
          arnKey: "trustStoreArn",
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#updateTrustStore-property
  update: {
    method: "updateTrustStore",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#deleteTrustStore-property
  destroy: {
    preDestroy: ({ endpoint }) =>
      tap(
        disassociate({
          endpoint,
          method: "disassociateTrustStore",
        })
      ),
    method: "deleteTrustStore",
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
    dependencies: {},
    config,
  }) =>
    pipe([
      tap(() => {
        assert(vpc);
        assert(subnets);
      }),
      () => otherProps,
      defaultsDeep({
        tags: buildTags({ name, config, namespace, UserTags: tags }),
      }),
    ])(),
});
