const assert = require("assert");
const { pipe, tap, get, pick, not, eq, map } = require("rubico");
const { defaultsDeep, isIn, prepend, when } = require("rubico/x");

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

const toServiceNetworkVpcAssociationIdentifier = pipe([
  tap(({ id, serviceNetworkId, vpcId }) => {
    assert(id);
    assert(serviceNetworkId);
    assert(vpcId);
  }),
  ({ id, serviceNetworkId, vpcId, ...other }) => ({
    serviceNetworkVpcAssociationIdentifier: id,
    serviceNetworkIdentifier: serviceNetworkId,
    vpcIdentifier: vpcId,
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
  tap(({ serviceNetworkVpcAssociationIdentifier }) => {
    assert(serviceNetworkVpcAssociationIdentifier);
  }),
  pick(["serviceNetworkVpcAssociationIdentifier"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    toServiceNetworkVpcAssociationIdentifier,
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html
exports.VpcLatticeServiceNetworkVpcAssociation = () => ({
  type: "ServiceNetworkVpcAssociation",
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
    "vpcIdentifier",
    "serviceNetworkVpcAssociationIdentifier",
    "serviceNetworkArn",
    "serviceNetworkId",
    "serviceNetworkName",
    "serviceNetworkIdentifier",
    "securityGroupIds",
  ],
  inferName:
    ({ dependenciesSpec: { vpc, serviceNetwork } }) =>
    ({}) =>
      pipe([
        tap((params) => {
          assert(vpc);
          assert(serviceNetwork);
        }),
        () => `${serviceNetwork}::${vpc}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ serviceNetworkName, vpcIdentifier }) =>
      pipe([
        tap((params) => {
          assert(vpcIdentifier);
          assert(serviceNetworkName);
        }),
        () => vpcIdentifier,
        lives.getById({
          type: "Vpc",
          group: "EC2",
          providerName: config.providerName,
        }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
        prepend(`${serviceNetworkName}::`),
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
    vpc: {
      type: "Vpc",
      group: "EC2",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("vpcIdentifier"),
          tap((vpcIdentifier) => {
            assert(vpcIdentifier);
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
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("securityGroupsIds"),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#getServiceNetworkVpcAssociation-property
  getById: {
    method: "getServiceNetworkVpcAssociation",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#listServiceNetworkVpcAssociations-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "ServiceNetwork", group: "VpcLattice" },
          pickKey: pipe([
            pick(["serviceNetworkIdentifier"]),
            tap(({ serviceNetworkIdentifier }) => {
              assert(serviceNetworkIdentifier);
            }),
          ]),
          method: "listServiceNetworkVpcAssociations",
          getParam: "items",
          config,
          decorate: () =>
            pipe([
              tap(({ id }) => {
                assert(id);
              }),
              ({ id }) => ({
                serviceNetworkVpcAssociationIdentifier: id,
              }),
              getById({}),
            ]),
        }),
    ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#createServiceNetworkVpcAssociation-property
  create: {
    method: "createServiceNetworkVpcAssociation",
    pickCreated: ({ payload }) =>
      pipe([
        defaultsDeep(payload),
        tap(({ id }) => {
          assert(id);
        }),
        ({ id }) => ({
          serviceNetworkVpcAssociationIdentifier: id,
        }),
      ]),
    isInstanceUp: pipe([get("status"), isIn(["ACTIVE"])]),
    isInstanceError: pipe([get("status"), isIn(["CREATE_FAILED"])]),
    getErrorMessage: pipe([get("failureMessage", "CREATE_FAILED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#updateServiceNetworkVpcAssociation-property
  update: {
    method: "updateServiceNetworkVpcAssociation",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        () => payload,
        toServiceNetworkVpcAssociationIdentifier,
        defaultsDeep(pickId(live)),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#deleteServiceNetworkVpcAssociation-property
  destroy: {
    method: "deleteServiceNetworkVpcAssociation",
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
    dependencies: { securityGroups, vpc, serviceNetwork },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(vpc);
        assert(serviceNetwork);
      }),
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
        serviceNetworkIdentifier: getField(
          serviceNetwork,
          "serviceNetworkIdentifier"
        ),
        vpcIdentifier: getField(vpc, "VpcId"),
      }),
      when(
        () => securityGroups,
        defaultsDeep({
          securityGroupIds: pipe([
            () => securityGroups,
            map((securityGroup) => getField(securityGroup, "GroupId")),
          ])(),
        })
      ),
    ])(),
});
