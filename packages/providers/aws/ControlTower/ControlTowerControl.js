const assert = require("assert");
const { pipe, tap, get, pick, eq, tryCatch } = require("rubico");
const { defaultsDeep, unless, isEmpty, find } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { replaceAccountAndRegion } = require("../AwsCommon");

// https://docs.aws.amazon.com/controltower/latest/userguide/controls.html

const pickId = pipe([
  tap(({ targetIdentifier, controlIdentifier }) => {
    assert(controlIdentifier);
    assert(targetIdentifier);
  }),
  pick(["targetIdentifier", "controlIdentifier"]),
]);

const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(live);
      assert(live.Arn);
    }),
    defaultsDeep({ targetIdentifier: live.Arn }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ControlTower.html
exports.ControlTowerControl = () => ({
  type: "Control",
  package: "controltower",
  client: "ControlTower",
  propertiesDefault: {},
  omitProperties: ["targetIdentifier"],
  inferName: ({
    properties: { controlIdentifier },
    dependenciesSpec: { organisationalUnit },
  }) =>
    pipe([
      tap((params) => {
        assert(organisationalUnit);
        assert(controlIdentifier);
      }),
      () => `${organisationalUnit}::${controlIdentifier}`,
    ])(),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        get("targetIdentifier"),
        tap((id) => {
          assert(id);
        }),
        (id) =>
          lives.getById({
            id,
            type: "OrganisationalUnit",
            group: "Organisations",
          }),
        get("name"),
        (organisationalUnit) =>
          `${organisationalUnit}::${live.controlIdentifier}`,
      ])(),
  findId: () =>
    pipe([
      get("controlIdentifier"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    organisationalUnit: {
      type: "OrganisationalUnit",
      group: "Organisations",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("targetIdentifier"),
          tap((targetIdentifier) => {
            assert(targetIdentifier);
          }),
        ]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        controlIdentifier: pipe([
          get("controlIdentifier"),
          replaceAccountAndRegion({ lives, providerConfig }),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ControlTower.html#listEnabledControls-property
  getById:
    ({ client, endpoint }) =>
    ({}) =>
    (live) =>
      pipe([
        tryCatch(
          pipe([
            tap((params) => {
              assert(live);
              assert(live.targetIdentifier);
            }),
            () => live,
            pick(["targetIdentifier"]),
            endpoint().listEnabledControls,
            get("enabledControls"),
            find(eq(get("controlIdentifier"), live.controlIdentifier)),
            unless(isEmpty, decorate({ endpoint, live })),
          ]),
          //TODO  ResourceNotFoundException
          (error) =>
            pipe([
              tap(() => {
                assert(error);
              }),
              () => undefined,
            ])()
        ),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ControlTower.html#listEnabledControls-property
  getList: ({ client, endpoint, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "OrganisationalUnit", group: "Organisations" },
          pickKey: pipe([
            tap(({ Arn }) => {
              assert(Arn);
            }),
            ({ Arn }) => ({ targetIdentifier: Arn }),
          ]),
          method: "listEnabledControls",
          getParam: "enabledControls",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap((params) => {
                assert(parent.Arn);
              }),
              defaultsDeep({ targetIdentifier: parent.Arn }),
            ]),
        }),
    ])(),
  create: {
    method: "enableControl",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: () => true,
  },
  // Custom update
  update:
    ({ endpoint, getById }) =>
    async ({ payload, live, diff }) =>
      pipe([
        () => diff,
        // disableControl
        // enableControl
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ControlTower.html#deleteControl-property
  destroy: {
    method: "disableControl",
    pickId,
    isInstanceDown: () => true,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { organisationalUnit },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(organisationalUnit);
      }),
      () => otherProps,
      defaultsDeep({
        targetIdentifier: getField(organisationalUnit, "Arn"),
      }),
    ])(),
});
