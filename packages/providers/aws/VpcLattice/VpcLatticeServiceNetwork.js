const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const toServiceNetworkIdentifier = pipe([
  tap(({ id }) => {
    assert(id);
  }),
  ({ id, ...other }) => ({
    serviceNetworkIdentifier: id,
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
  tap(({ serviceNetworkIdentifier }) => {
    assert(serviceNetworkIdentifier);
  }),
  pick(["serviceNetworkIdentifier"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    toServiceNetworkIdentifier,
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html
exports.VpcLatticeServiceNetwork = () => ({
  type: "ServiceNetwork",
  package: "vpc-lattice",
  client: "VPCLattice",
  propertiesDefault: {},
  omitProperties: [
    "arn",
    "serviceNetworkIdentifier",
    "numberOfAssociatedServices",
    "createdAt",
    "lastUpdatedAt",
    "numberOfAssociatedVPCs",
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
      get("arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {},
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#getServiceNetwork-property
  getById: {
    method: "getServiceNetwork",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#listServiceNetworks-property
  getList: {
    method: "listServiceNetworks",
    getParam: "items",
    decorate: ({ getById }) => pipe([toServiceNetworkIdentifier, getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#createServiceNetwork-property
  create: {
    method: "createServiceNetwork",
    pickCreated: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(params);
        }),
        toServiceNetworkIdentifier,
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#updateServiceNetwork-property
  update: {
    method: "updateServiceNetwork",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        () => payload,
        toServiceNetworkIdentifier,
        defaultsDeep(pickId(live)),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#deleteServiceNetwork-property
  destroy: {
    method: "deleteServiceNetwork",
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
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
    ])(),
});
