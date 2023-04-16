const assert = require("assert");
const { pipe, tap, get, pick, assign, map } = require("rubico");
const { defaultsDeep, append, pluck } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

const toListenerIdentifier = pipe([
  tap((params) => {
    assert(true);
  }),
  tap(({ id, serviceId }) => {
    assert(id);
    assert(serviceId);
  }),
  ({ id, serviceId, ...other }) => ({
    listenerIdentifier: id,
    serviceIdentifier: serviceId,
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
  tap(({ listenerIdentifier, serviceIdentifier }) => {
    assert(listenerIdentifier);
    assert(serviceIdentifier);
  }),
  pick(["serviceIdentifier", "listenerIdentifier"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    toListenerIdentifier,
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html
exports.VpcLatticeListener = () => ({
  type: "Listener",
  package: "vpc-lattice",
  client: "VPCLattice",
  propertiesDefault: {},
  omitProperties: [
    "arn",
    "listenerIdentifier",
    "serviceIdentifier",
    "serviceArn",
    "serviceId",
    "createdAt",
    "lastUpdatedAt",
  ],
  inferName:
    ({ dependenciesSpec: { service } }) =>
    ({ name }) =>
      pipe([
        tap((params) => {
          assert(service);
          assert(name);
        }),
        () => `${service}::${name}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ name, serviceArn }) =>
      pipe([
        tap((params) => {
          assert(serviceArn);
          assert(name);
        }),
        () => serviceArn,
        lives.getById({
          type: "Service",
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
      get("listenerIdentifier"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    service: {
      type: "Service",
      group: "VpcLattice",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("serviceArn"),
          tap((serviceArn) => {
            assert(serviceArn);
          }),
        ]),
    },
    targetGroups: {
      type: "TargetGroup",
      group: "VpcLattice",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("defaultAction.forward.targetGroups"),
          pluck("targetGroupIdentifier"),
        ]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        defaultAction: pipe([
          get("defaultAction"),
          assign({
            forward: pipe([
              get("forward"),
              assign({
                targetGroups: pipe([
                  get("targetGroups"),
                  map(
                    assign({
                      targetGroupIdentifier: pipe([
                        get("targetGroupIdentifier"),
                        replaceWithName({
                          groupType: "VpcLattice::TargetGroup",
                          path: "id",
                          providerConfig,
                          lives,
                        }),
                      ]),
                    })
                  ),
                ]),
              }),
            ]),
          }),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#getListener-property
  getById: {
    method: "getListener",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#listListeners-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Service", group: "VpcLattice" },
          pickKey: pipe([
            pick(["serviceIdentifier"]),
            tap(({ serviceIdentifier }) => {
              assert(serviceIdentifier);
            }),
          ]),
          method: "listListeners",
          getParam: "items",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap((params) => {
                assert(parent);
              }),
              defaultsDeep({ serviceId: parent.serviceIdentifier }),
              toListenerIdentifier,
              tap((params) => {
                assert(true);
              }),
              getById({}),
            ]),
        }),
    ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#createListener-property
  create: {
    method: "createListener",
    pickCreated: ({ payload }) => pipe([toListenerIdentifier]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#updateListener-property
  update: {
    method: "updateListener",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, toListenerIdentifier, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#deleteListener-property
  destroy: {
    method: "deleteListener",
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
    dependencies: { service },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(service);
      }),
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
        serviceIdentifier: getField(service, "serviceIdentifier"),
      }),
    ])(),
});
