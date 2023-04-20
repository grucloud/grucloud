const assert = require("assert");
const { pipe, tap, get, pick, fork } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ StudioId, IdentityType, SessionPolicyArn }) => {
    assert(StudioId);
    assert(IdentityType);
    assert(SessionPolicyArn);
  }),
  pick(["StudioId", "IdentityType", "SessionPolicyArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMR.html
exports.EMRStudioSessionMapping = () => ({
  type: "StudioSessionMapping",
  package: "emr",
  client: "EMR",
  propertiesDefault: {},
  omitProperties: [
    "StudioId",
    "SessionPolicyArn",
    "CreationTime",
    "LastModifiedTime",
  ],
  inferName:
    ({ dependenciesSpec: { studio, sessionPolicy } }) =>
    () =>
      pipe([
        tap((params) => {
          assert(studio);
          assert(sessionPolicy);
        }),
        () => `${studio}::${sessionPolicy}`,
      ])(),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        fork({
          studio: pipe([
            get("StudioId"),
            lives.getById({
              type: "Studio",
              group: "EMR",
              providerName: config.providerName,
            }),
            get("name", live.StudioId),
          ]),
          sessionPolicy: pipe([
            get("SessionPolicyArn"),
            lives.getById({
              type: "Policy",
              group: "IAM",
              providerName: config.providerName,
            }),
            get("name", live.SessionPolicyArn),
          ]),
        }),
        ({ studio, sessionPolicy }) => `${studio}::${sessionPolicy}`,
      ])(),
  findId: () =>
    pipe([
      tap((params) => {
        assert(StudioId);
        assert(SessionPolicyArn);
      }),
      ({ StudioId, SessionPolicyArn }) => `${StudioId}::${SessionPolicyArn}`,
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException", "InvalidRequestException"],
  dependencies: {
    sessionPolicy: {
      type: "Policy",
      group: "IAM",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("SessionPolicyArn"),
          tap((SessionPolicyArn) => {
            assert(SessionPolicyArn);
          }),
        ]),
    },
    studio: {
      type: "Studio",
      group: "EMR",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("StudioId"),
          tap((StudioId) => {
            assert(StudioId);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMR.html#getStudioSessionMapping-property
  getById: {
    method: "getStudioSessionMapping",
    getField: "SessionMapping",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMR.html#listStudioSessionMappings-property
  getList: {
    method: "listStudioSessionMappings",
    getParam: "SessionMappings",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMR.html#createStudioSessionMapping-property
  create: {
    method: "createStudioSessionMapping",
    pickCreated: ({ payload }) => pipe([get("SessionMapping")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMR.html#updateStudioSessionMapping-property
  update: {
    method: "updateStudioSessionMapping",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMR.html#deleteStudioSessionMapping-property
  destroy: {
    method: "deleteStudioSessionMapping",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { sessionPolicy, studio },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(sessionPolicy);
        assert(studio);
      }),
      () => otherProps,
      defaultsDeep({
        SessionPolicyArn: getField(sessionPolicy, "Arn"),
        StudioId: getField(studio, "StudioId"),
      }),
    ])(),
});
