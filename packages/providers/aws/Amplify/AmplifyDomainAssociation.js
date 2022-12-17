const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ appId, domainName }) => {
    assert(appId);
    assert(domainName);
  }),
  pick(["appId", "domainName"]),
]);

const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(live.appId);
    }),
    defaultsDeep({ appId: live.appId }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amplify.html
exports.AmplifyDomainAssociation = () => ({
  type: "DomainAssociation",
  package: "amplify",
  client: "Amplify",
  propertiesDefault: {},
  omitProperties: [
    "appId",
    "appName",
    "domainAssociationArn",
    "domainStatus",
    "certificateVerificationDNSRecord",
  ],
  inferName:
    ({ dependenciesSpec: { app } }) =>
    ({ domainName }) =>
      pipe([
        tap((params) => {
          assert(app);
          assert(domainName);
        }),
        () => `${app}::${domainName}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ appName, domainName }) =>
      pipe([
        tap((params) => {
          assert(appName);
          assert(domainName);
        }),
        () => `${appName}::${live.domainName}`,
      ])(),
  findId: () =>
    pipe([
      get("webhookArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    app: {
      type: "App",
      group: "Amplify",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("appId")]),
    },
    branches: {
      type: "Branch",
      group: "Amplify",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("subDomains"),
          map(pipe([get("subDomainSetting.branchName")])),
        ]),
    },
  },
  ignoreErrorCodes: ["NotFoundException", "BadRequestException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amplify.html#getDomainAssociation-property
  getById: {
    method: "getDomainAssociation",
    getField: "domainAssociation",
    pickId,
    decorate,
  },
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "App", group: "Amplify" },
          pickKey: pipe([pick(["appId"])]),
          method: "listDomainAssociations",
          getParam: "webdomainAssociationshooks",
          config,
          decorate: ({ parent }) =>
            pipe([defaultsDeep({ appId: parent.appId })]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amplify.html#createDomainAssociation-property
  create: {
    method: "createDomainAssociation",
    pickCreated: ({ payload }) => pipe([get("webhook")]),
    isInstanceUp: pipe([eq(get("domainStatus"), "AVAILABLE")]),
    isInstanceError: pipe([eq(get("domainStatus"), "FAILED")]),
    getErrorMessage: get("statusReason", "FAILED"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amplify.html#updateDomainAssociation-property
  update: {
    method: "updateDomainAssociation",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amplify.html#deleteDomainAssociation-property
  destroy: {
    method: "deleteDomainAssociation",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    properties: { tags, ...otherProps },
    dependencies: { app },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(app);
      }),
      () => otherProps,
      defaultsDeep({
        appId: getField(app, "appId"),
      }),
    ])(),
});
