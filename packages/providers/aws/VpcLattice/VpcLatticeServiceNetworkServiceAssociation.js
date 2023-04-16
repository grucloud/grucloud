const assert = require("assert");
const { pipe, tap, get, pick, not, eq } = require("rubico");
const { defaultsDeep, isIn } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const managedByOther = ({ config }) =>
  pipe([
    tap((params) => {
      assert(config);
      assert(config.accountId());
    }),
    not(eq(get("createdBy"), config.accountId())),
  ]);

const toServiceNetworkServiceAssociationIdentifier = pipe([
  tap((arn) => {
    assert(arn);
  }),
  tap(({ id, serviceNetworkId, serviceId }) => {
    assert(id);
    assert(serviceNetworkId);
    assert(serviceId);
  }),
  ({ id, serviceNetworkId, serviceId, ...other }) => ({
    serviceNetworkServiceAssociationIdentifier: id,
    serviceNetworkIdentifier: serviceNetworkId,
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
  tap(({ serviceNetworkServiceAssociationIdentifier }) => {
    assert(serviceNetworkServiceAssociationIdentifier);
  }),
  pick(["serviceNetworkServiceAssociationIdentifier"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    toServiceNetworkServiceAssociationIdentifier,
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html
exports.VpcLatticeServiceNetworkServiceAssociation = () => ({
  type: "ServiceNetworkServiceAssociation",
  package: "vpc-lattice",
  client: "VPCLattice",
  propertiesDefault: {},
  omitProperties: [
    "arn",
    "createdAt",
    "createdBy",
    "customDomainName",
    "failureCode",
    "failureMessage",
    "lastUpdatedAt",
    "status",
    "vpcId",
    "serviceNetworkServiceAssociationIdentifier",
    "serviceNetworkArn",
    "serviceNetworkId",
    "serviceNetworkName",
    "serviceNetworkIdentifier",
    "serviceArn",
    "serviceName",
    "serviceIdentifier",
    "dnsEntry",
  ],
  inferName:
    ({ dependenciesSpec: { service, serviceNetwork } }) =>
    ({}) =>
      pipe([
        tap((params) => {
          assert(service);
          assert(serviceNetwork);
        }),
        () => `${serviceNetwork}::${service}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ serviceName, serviceNetworkName }) =>
      pipe([
        tap((params) => {
          assert(serviceName);
          assert(serviceNetworkName);
        }),
        () => `${serviceNetworkName}::${serviceName}`,
      ])(),
  findId: () =>
    pipe([
      get("arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  managedByOther,
  cannotBeDeleted: managedByOther,
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
    serviceNetwork: {
      type: "ServiceNetwork",
      group: "VpcLattice",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("serviceNetworkArn"),
          tap((serviceNetworkArn) => {
            assert(serviceNetworkArn);
          }),
        ]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#getServiceNetworkServiceAssociation-property
  getById: {
    method: "getServiceNetworkServiceAssociation",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#listServiceNetworkServiceAssociations-property
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
          method: "listServiceNetworkServiceAssociations",
          getParam: "items",
          config,
          decorate: () =>
            pipe([
              tap(({ id }) => {
                assert(id);
              }),
              ({ id }) => ({
                serviceNetworkServiceAssociationIdentifier: id,
              }),
              getById({}),
            ]),
        }),
    ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#createServiceNetworkServiceAssociation-property
  create: {
    method: "createServiceNetworkServiceAssociation",
    pickCreated: ({ payload }) =>
      pipe([
        defaultsDeep(payload),
        tap(({ id }) => {
          assert(id);
        }),
        ({ id }) => ({
          serviceNetworkServiceAssociationIdentifier: id,
        }),
      ]),
    isInstanceUp: pipe([get("status"), isIn(["ACTIVE"])]),
    isInstanceError: pipe([get("status"), isIn(["CREATE_FAILED"])]),
    getErrorMessage: pipe([get("failureMessage", "CREATE_FAILED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#updateServiceNetworkServiceAssociation-property
  update: {
    method: "updateServiceNetworkServiceAssociation",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        () => payload,
        toServiceNetworkServiceAssociationIdentifier,
        defaultsDeep(pickId(live)),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#deleteServiceNetworkServiceAssociation-property
  destroy: {
    method: "deleteServiceNetworkServiceAssociation",
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
    dependencies: { service, serviceNetwork },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(service);
        assert(serviceNetwork);
      }),
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
        serviceNetworkIdentifier: getField(
          serviceNetwork,
          "serviceNetworkIdentifier"
        ),
        serviceIdentifier: getField(service, "serviceIdentifier"),
      }),
    ])(),
});
