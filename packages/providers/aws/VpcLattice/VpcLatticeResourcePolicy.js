const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  flatMap,
  map,
  not,
  filter,
  switchCase,
  tryCatch,
  fork,
  assign,
} = require("rubico");
const { defaultsDeep, isEmpty } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ resourceArn }) => {
    assert(resourceArn);
  }),
  pick(["resourceArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap(({ policy }) => {
      assert(policy);
    }),
    assign({ policy: pipe([get("policy"), JSON.parse]) }),
  ]);

const filterPayload = pipe([
  tap(({ policy }) => {
    assert(policy);
  }),
  assign({
    policy: pipe([get("policy"), JSON.stringify]),
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html
exports.VpcLatticeResourcePolicy = () => ({
  type: "ResourcePolicy",
  package: "vpc-lattice",
  client: "VPCLattice",
  propertiesDefault: {},
  omitProperties: ["resourceArn"],
  inferName:
    ({ dependenciesSpec: { service, serviceNetwork } }) =>
    ({}) =>
      pipe([
        tap((params) => {
          assert(service || serviceNetwork);
        }),
        () => service || serviceNetwork,
      ])(),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        get("resourceArn"),
        tap((resourceArn) => {
          assert(resourceArn);
        }),
        fork({
          service: pipe([
            lives.getById({
              type: "Service",
              group: "VpcLattice",
              providerName: config.providerName,
            }),
            get("name"),
          ]),
          serviceNetwork: pipe([
            lives.getById({
              type: "ServiceNetwork",
              group: "VpcLattice",
              providerName: config.providerName,
            }),
            get("name"),
          ]),
        }),
        tap(({ service, serviceNetwork }) => {
          assert(service || serviceNetwork);
        }),
        ({ service, serviceNetwork }) => service || serviceNetwork,
      ])(),
  findId: () =>
    pipe([
      get("resourceArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    service: {
      type: "Service",
      group: "VpcLattice",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("resourceArn")]),
    },
    serviceNetwork: {
      type: "ServiceNetwork",
      group: "VpcLattice",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("resourceArn")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#getResourcePolicy-property
  getById: {
    method: "getResourcePolicy",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#listResourcePolicys-property
  getList:
    ({ endpoint }) =>
    ({ lives, config }) =>
      pipe([
        tap((params) => {
          assert(config);
        }),
        () => ["Service", "ServiceNetwork"],
        flatMap(
          tryCatch(
            (type) =>
              pipe([
                lives.getByType({
                  type,
                  group: "VpcLattice",
                  providerName: config.providerName,
                }),
                map(
                  pipe([
                    tap((params) => {
                      assert(true);
                    }),
                    get("id"),
                    (resourceArn) => ({ resourceArn }),
                    endpoint().getResourcePolicy,
                    decorate({}),
                  ])
                ),
                tap((params) => {
                  assert(true);
                }),
              ])(),
            (error) =>
              pipe([
                tap(() => {
                  assert(error);
                }),
                () => undefined,
              ])()
          )
        ),
        tap((params) => {
          assert(true);
        }),
        filter(not(isEmpty)),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#putResourcePolicy-property
  create: {
    filterPayload,
    method: "putResourcePolicy",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#putResourcePolicy-property
  update: {
    method: "putResourcePolicy",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, filterPayload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#deleteResourcePolicy-property
  destroy: {
    method: "deleteResourcePolicy",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { service, serviceNetwork },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(service || serviceNetwork);
      }),
      () => otherProps,
      switchCase([
        () => service,
        defaultsDeep({
          resourceArn: getField(service, "serviceIdentifier"),
        }),
        () => serviceNetwork,
        defaultsDeep({
          resourceArn: getField(serviceNetwork, "serviceNetworkIdentifier"),
        }),
        () => {
          assert(false, "missing service or serviceNetwork dependency");
        },
      ]),
    ])(),
});
