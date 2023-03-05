const {
  get,
  pipe,
  tap,
  pick,
  map,
  filter,
  not,
  eq,
  flatMap,
  and,
} = require("rubico");
const { defaultsDeep, first, find } = require("rubico/x");
const assert = require("assert");

const { getField } = require("@grucloud/core/ProviderCommon");

const findId = () =>
  pipe([
    get("AssociationId"),
    tap((id) => {
      assert(id);
    }),
  ]);

const pickId = pipe([
  pick(["AssociationId"]),
  tap(({ AssociationId }) => {
    assert(AssociationId);
  }),
]);

const decorate = ({ endpoint, lives, config, live }) =>
  pipe([
    tap((params) => {
      assert(lives);
      assert(live);
      assert(live.CidrBlock);
    }),
    get("CidrBlockAssociationSet"),
    find(eq(get("CidrBlock"), live.CidrBlock)),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html
exports.EC2VpcIpv4CidrBlockAssociation = ({ compare }) => ({
  type: "VpcIpv4CidrBlockAssociation",
  package: "ec2",
  client: "EC2",
  propertiesDefault: {},
  omitProperties: ["AssociationId", "CidrBlockState", "VpcId"],
  compare: compare({ filterAll: () => pipe([pick([])]) }),
  dependencies: {
    vpc: {
      type: "Vpc",
      group: "EC2",
      parent: true,
      dependencyId: ({ lives, config }) => get("VpcId"),
    },
  },
  inferName: () =>
    pipe([
      get("CidrBlock"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findName: () =>
    pipe([
      get("CidrBlock"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId,
  ignoreErrorCodes: ["InvalidVpcCidrBlockAssociationID.NotFound"],
  getById: {
    method: "describeVpcs",
    getField: "Vpcs",
    pickId: ({ VpcId }) => ({ VpcIds: [VpcId] }),
    decorate,
  },
  getList:
    ({ client, endpoint, getById, config }) =>
    ({ lives }) =>
      pipe([
        lives.getByType({
          type: "Vpc",
          group: "EC2",
          providerName: config.providerName,
        }),
        flatMap(
          pipe([
            get("live"),
            ({ CidrBlockAssociationSet, VpcId, CidrBlock }) =>
              pipe([
                tap((params) => {
                  assert(CidrBlockAssociationSet);
                  assert(VpcId);
                  assert(CidrBlock);
                }),
                () => CidrBlockAssociationSet,
                filter(
                  and([
                    not(eq(get("CidrBlock"), CidrBlock)),
                    not(eq(get("CidrBlockState.State"), "disassociated")),
                  ])
                ),
                map(pipe([defaultsDeep({ VpcId })])),
              ])(),
          ])
        ),
      ])(),
  create: {
    method: "associateVpcCidrBlock",
    pickCreated: ({ payload }) => pipe([() => payload]),
    // isInstanceUp: pipe([eq(get("State"), "available")]),
  },
  destroy: {
    method: "disassociateVpcCidrBlock",
    pickId,
    isInstanceDown: pipe([eq(get("CidrBlockState.State"), "disassociated")]),
    shouldRetryOnExceptionCodes: ["InvalidCidrBlock.InUse"],
  },
  getByName:
    ({ endpoint, getList }) =>
    ({ name, resolvedDependencies: { vpc } }) =>
      pipe([
        () => vpc,
        get("live.VpcId"),
        (VpcId) => ({ VpcIds: [VpcId] }),
        endpoint().describeVpcs,
        get("Vpcs"),
        first,
        get("CidrBlockAssociationSet"),
        filter(not(eq(get("CidrBlockState.State"), "disassociated"))),
        find(eq(get("CidrBlock"), name)),
      ])(),
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { vpc },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(vpc);
      }),
      () => otherProps,
      defaultsDeep({
        VpcId: getField(vpc, "VpcId"),
      }),
    ])(),
});
