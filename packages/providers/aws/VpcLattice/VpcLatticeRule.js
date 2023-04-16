const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, append } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const managedByOther = () => pipe([get("isDefault")]);

const toRuleIdentifier = pipe([
  tap(({ id, listenerIdentifier, serviceIdentifier }) => {
    assert(id);
    assert(listenerIdentifier);
    assert(serviceIdentifier);
  }),
  ({ id, ...other }) => ({
    ruleIdentifier: id,
    ...other,
  }),
]);

const { Tagger, assignTags } = require("./VpcLatticeCommon");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ listenerIdentifier, serviceIdentifier, ruleIdentifier }) => {
    assert(listenerIdentifier);
    assert(serviceIdentifier);
    assert(ruleIdentifier);
  }),
  pick(["serviceIdentifier", "listenerIdentifier", "ruleIdentifier"]),
]);

const decorate = ({ endpoint, config, live }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    defaultsDeep(pick(["serviceIdentifier", "listenerIdentifier"])(live)),
    toRuleIdentifier,
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html
exports.VpcLatticeRule = () => ({
  type: "Rule",
  package: "vpc-lattice",
  client: "VPCLattice",
  propertiesDefault: {},
  omitProperties: [
    "arn",
    "listenerIdentifier",
    "serviceIdentifier", //
    "isDefault",
    "lastUpdatedAt",
    "createdAt",
  ],
  inferName:
    ({ dependenciesSpec: { listener } }) =>
    ({ name }) =>
      pipe([
        tap((params) => {
          assert(listener);
          assert(name);
        }),
        () => `${listener}::${name}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ name, listenerIdentifier }) =>
      pipe([
        tap((params) => {
          assert(listenerIdentifier);
          assert(name);
        }),
        () => listenerIdentifier,
        lives.getById({
          type: "Listener",
          group: "VpcLattice",
          providerName: config.providerName,
        }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
        append(`::${name}`),
      ])(),
  findId: () =>
    pipe([
      get("arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    listener: {
      type: "Listener",
      group: "VpcLattice",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("listenerIdentifier"),
          tap((listenerIdentifier) => {
            assert(listenerIdentifier);
          }),
        ]),
    },
  },
  managedByOther,
  cannotBeDeleted: managedByOther,
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#getRule-property
  getById: {
    method: "getRule",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#listRules-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Listener", group: "VpcLattice" },
          pickKey: pipe([pick(["serviceIdentifier", "listenerIdentifier"])]),
          method: "listRules",
          getParam: "items",
          config,
          decorate: ({ parent }) =>
            pipe([
              defaultsDeep(
                pick(["serviceIdentifier", "listenerIdentifier"])(parent)
              ),
              toRuleIdentifier,
              getById({}),
            ]),
        }),
    ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#createRule-property
  create: {
    method: "createRule",
    pickCreated: ({ payload }) => pipe([toRuleIdentifier]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#updateRule-property
  update: {
    method: "updateRule",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, toRuleIdentifier, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#deleteRule-property
  destroy: {
    method: "deleteRule",
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
    dependencies: { listener },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(listener);
      }),
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
        serviceIdentifier: getField(listener, "serviceIdentifier"),
      }),
    ])(),
});
