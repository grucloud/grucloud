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
  tap(({ resourceIdentifier }) => {
    assert(resourceIdentifier);
  }),
  pick(["resourceIdentifier"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
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

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VpcLattice.html
exports.VpcLatticeAuthPolicy = () => ({
  type: "AuthPolicy",
  package: "vpc-lattice",
  client: "VPCLattice",
  propertiesDefault: {},
  omitProperties: ["resourceIdentifier", "createdAt", "lastUpdatedAt", "state"],
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
      get("resourceIdentifier"),
      tap((resourceIdentifier) => {
        assert(resourceIdentifier);
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VpcLattice.html#getAuthPolicy-property
  getById: {
    method: "getAuthPolicy",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VpcLattice.html#listAuthPolicys-property
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
                    (resourceIdentifier) => ({ resourceIdentifier }),
                    endpoint().getAuthPolicy,
                    decorate({}),
                  ])
                ),
                tap((params) => {
                  assert(true);
                }),
              ])(),
            (error) =>
              pipe([
                tap((params) => {
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VpcLattice.html#putAuthPolicy-property
  create: {
    filterPayload,
    method: "putAuthPolicy",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VpcLattice.html#putAuthPolicy-property
  update: {
    method: "putAuthPolicy",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, filterPayload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VpcLattice.html#deleteAuthPolicy-property
  destroy: {
    method: "deleteAuthPolicy",
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
          resourceIdentifier: getField(service, "serviceIdentifier"),
        }),
        () => serviceNetwork,
        defaultsDeep({
          resourceIdentifier: getField(
            serviceNetwork,
            "serviceNetworkIdentifier"
          ),
        }),
        () => {
          assert(false, "missing service or serviceNetwork dependency");
        },
      ]),
    ])(),
});
