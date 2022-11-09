const assert = require("assert");
const { pipe, tap, get, map, pick, fork, filter } = require("rubico");
const { defaultsDeep, first, unless, isEmpty, pluck } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");

const pickId = pipe([pick(["AssociationId"])]);

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidAssociationID.NotFound"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#associateAddress-property
  create: { method: "associateAddress" },
  destroy: {
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#disassociateAddress-property
    method: "disassociateAddress",
    pickId,
  },
});

const findId = pipe([
  get("live"),
  unless(
    isEmpty,
    ({ InstanceId, AllocationId }) =>
      `eip-attach::${AllocationId}::${InstanceId}`
  ),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2ElasticIpAddressAssociation = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: ({ live, lives }) =>
      pipe([
        fork({
          instance: pipe([
            () =>
              lives.getById({
                id: live.InstanceId,
                type: "Instance",
                group: "EC2",
                providerName: config.providerName,
              }),
            get("name"),
          ]),
          eip: pipe([
            () =>
              lives.getById({
                id: live.AllocationId,
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
    getList:
      ({ endpoint }) =>
      ({ lives }) =>
        pipe([
          () =>
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
