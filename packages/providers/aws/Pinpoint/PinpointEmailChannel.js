const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ ApplicationId }) => {
    assert(ApplicationId);
  }),
  pick(["ApplicationId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const filterPayload = pipe([
  tap(({ ApplicationId }) => {
    assert(ApplicationId);
  }),
  ({ ApplicationId, ...EmailChannelRequest }) => ({
    ApplicationId,
    EmailChannelRequest,
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Pinpoint.html
exports.PinpointEmailChannel = () => ({
  type: "EmailChannel",
  package: "pinpoint",
  client: "Pinpoint",
  propertiesDefault: {},
  omitProperties: [
    "ApplicationId",
    "CreationDate",
    "Id",
    "Identity",
    "ConfigurationSet",
    "HasCredential",
    "IsArchived",
    "LastModifiedBy",
    "LastModifiedDate",
    "Platform",
    "Version",
    "RoleArn",
  ],
  inferName: ({ dependenciesSpec: { app } }) =>
    pipe([
      tap((params) => {
        assert(app);
      }),
      () => app,
    ]),
  findName:
    ({ lives, config }) =>
    ({ ApplicationId }) =>
      pipe([
        tap(() => {
          assert(ApplicationId);
        }),
        () => ApplicationId,
        lives.getById({
          type: "App",
          group: "Pinpoint",
          providerName: config.providerName,
        }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
      ])(),
  findId: () =>
    pipe([
      get("ApplicationId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["NotFoundException"],
  dependencies: {
    app: {
      type: "App",
      group: "Pinpoint",
      parent: true,
      dependencyId: () =>
        pipe([
          get("ApplicationId"),
          tap((ApplicationId) => {
            assert(ApplicationId);
          }),
        ]),
    },
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => get("RoleArn"),
    },
    sesv2ConfigurationSet: {
      type: "ConfigurationSet",
      group: "SESV2",
      dependencyId: () => pipe([get("ConfigurationSet")]),
    },
    sesv2Identity: {
      type: "Identity",
      group: "SESV2",
      dependencyId: () =>
        pipe([
          get("Identity"),
          tap((Identity) => {
            assert(Identity);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Pinpoint.html#getEmailChannel-property
  getById: {
    method: "getEmailChannel",
    getField: "EmailChannelResponse",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Pinpoint.html#getEmailChannel-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "App", group: "Pinpoint" },
          pickKey: pipe([
            pick(["ApplicationId"]),
            tap(({ ApplicationId }) => {
              assert(ApplicationId);
            }),
          ]),
          method: "getEmailChannel",
          getParam: "EmailChannelResponse",
          config,
          decorate: ({ parent }) =>
            pipe([decorate({ endpoint, config, live: parent })]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Pinpoint.html#updateEmailChannel-property
  create: {
    filterPayload,
    method: "updateEmailChannel",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Pinpoint.html#updateEmailChannel-property
  update: {
    method: "updateEmailChannel",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, filterPayload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Pinpoint.html#deleteEmailChannel-property
  destroy: {
    method: "deleteEmailChannel",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { app, iamRole, sesv2Identity, sesv2ConfigurationSet },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(app);
        assert(sesv2Identity);
      }),
      () => otherProps,
      defaultsDeep({
        ApplicationId: getField(app, "ApplicationId"),
        Identity: getField(sesv2Identity, "Id"),
      }),
      when(
        () => iamRole,
        defaultsDeep({
          RoleArn: getField(iamRole, "Arn"),
        })
      ),
      when(
        () => sesv2ConfigurationSet,
        defaultsDeep({
          ConfigurationSet: getField(sesv2ConfigurationSet, "Arn"),
        })
      ),
    ])(),
});
