const assert = require("assert");
const { pipe, tap, get, map, pick, fork, filter } = require("rubico");
const {
  defaultsDeep,
  first,
  unless,
  isEmpty,
  pluck,
  when,
  append,
} = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([pick(["AssociationId"])]);

const findId = () =>
  pipe([
    unless(
      isEmpty,
      ({ InstanceId, AllocationId }) =>
        `eip-attach::${AllocationId}::${InstanceId}`
    ),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2ElasticIpAddressAssociation = ({ compare }) => ({
  type: "ElasticIpAddressAssociation",
  package: "ec2",
  client: "EC2",
  inferName:
    ({ dependenciesSpec: { eip, instance } }) =>
    () =>
      pipe([
        tap(() => {
          assert(eip);
        }),
        () => `eip-attach::${eip}`,
        when(() => instance, append(`::${instance}`)),
      ])(),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        fork({
          instance: pipe([
            () => live,
            get("InstanceId"),
            lives.getById({
              type: "Instance",
              group: "EC2",
              providerName: config.providerName,
            }),
            get("name"),
          ]),
          eip: pipe([
            () => live,
            get("AllocationId"),
            lives.getById({
              type: "ElasticIpAddress",
              group: "EC2",
              providerName: config.providerName,
            }),
            get("name"),
          ]),
        }),
        tap(({ instance, eip }) => {
          assert(instance);
          assert(eip);
        }),
        ({ instance, eip }) => `eip-attach::${eip}::${instance}`,
      ])(),
  findId,
  pickId,
  dependencies: {
    eip: {
      type: "ElasticIpAddress",
      group: "EC2",
      parent: true,
      dependencyId: ({ lives, config }) => get("AllocationId"),
    },
    instance: {
      type: "Instance",
      group: "EC2",
      parent: true,
      dependencyId: ({ lives, config }) => get("InstanceId"),
    },
  },
  omitProperties: ["InstanceId", "AllocationId", "AssociationId"],
  ignoreErrorCodes: ["InvalidAssociationID.NotFound"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#associateAddress-property
  create: { method: "associateAddress" },
  destroy: {
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#disassociateAddress-property
    method: "disassociateAddress",
    pickId,
  },
  getList:
    ({ endpoint }) =>
    ({ lives, config }) =>
      pipe([
        lives.getByType({
          providerName: config.providerName,
          type: "ElasticIpAddress",
          group: "EC2",
        }),
        pluck("live"),
        filter(get("InstanceId")),
        map(pick(["InstanceId", "AllocationId", "AssociationId"])),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeAddresses-property
  getByName:
    ({ getById, endpoint }) =>
    ({ resolvedDependencies: { instance, eip } }) =>
      pipe([
        tap((params) => {
          assert(endpoint);
          assert(instance);
          assert(eip);
        }),
        () => ({
          AllocationIds: [eip.live.AllocationId],
          Filters: [
            {
              Name: "instance-id",
              Values: [instance.live.InstanceId],
            },
          ],
        }),
        endpoint().describeAddresses,
        get("Addresses"),
        first,
      ])(),
  configDefault: ({
    name,
    namespace,
    properties,
    dependencies: { instance, eip },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(instance);
        assert(eip);
      }),
      () => properties,
      defaultsDeep({
        InstanceId: getField(instance, "InstanceId"),
        AllocationId: getField(eip, "AllocationId"),
      }),
    ])(),
});
