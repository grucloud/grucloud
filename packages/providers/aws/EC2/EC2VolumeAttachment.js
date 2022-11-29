const assert = require("assert");
const { tap, get, pipe, map, fork, eq, pick } = require("rubico");
const { defaultsDeep, find, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const { createEC2 } = require("./EC2Common");

const ignoreErrorCodes = ["InvalidVolume.NotFound"];

exports.EC2VolumeAttachment = ({ spec, config }) => {
  const ec2 = createEC2(config);

  const client = AwsClient({ spec, config })(ec2);
  const findId = () =>
    pipe([({ VolumeId, InstanceId }) => `${VolumeId}::${InstanceId}`]);

  const findName =
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        fork({
          volume: pipe([
            tap(() => {
              assert(live.VolumeId);
            }),
            get("VolumeId"),
            lives.getById({
              providerName: config.providerName,
              type: "Volume",
              group: "EC2",
            }),
            get("name"),
            tap((volume) => {
              assert(volume);
            }),
          ]),
          instance: pipe([
            tap(() => {
              assert(live.InstanceId);
            }),
            get("InstanceId"),
            lives.getById({
              providerName: config.providerName,
              type: "Instance",
              group: "EC2",
            }),
            get("name"),
            tap((instance) => {
              assert(instance);
            }),
          ]),
        }),
        ({ volume, instance }) => `vol-attachment::${volume}::${instance}`,
      ])();

  const getList = client.getListWithParent({
    parent: { type: "Volume", group: "EC2" },
    config,
    decorate: ({
      name,
      managedByOther,
      parent: { VolumeId, Attachments = [] },
    }) =>
      pipe([
        tap((params) => {
          assert(VolumeId);
        }),
        () => undefined,
        when(
          () => !managedByOther,
          pipe([() => Attachments, map(defaultsDeep({ VolumeId }))])
        ),
      ]),
  });

  const getByName = getByNameCore({ getList, findName });

  const getById = client.getById({
    pickId: ({ InstanceId, VolumeId }) => ({
      VolumeIds: [VolumeId],
      Filters: [
        {
          Name: "attachment.instance-id",
          Values: [InstanceId],
        },
        {
          Name: "tag-key",
          Values: [config.managedByKey],
        },
      ],
    }),
    method: "describeVolumes",
    getField: "Volumes",
    ignoreErrorCodes,
    decorate: ({ live: { VolumeId, InstanceId } }) =>
      pipe([
        tap((params) => {
          assert(InstanceId);
          assert(VolumeId);
        }),
        get("Attachments"),
        find(eq(get("InstanceId"), InstanceId)),
        tap((attachment) => {
          assert(attachment);
        }),
        defaultsDeep({ VolumeId }),
      ]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#attachVolume-property
  const create = client.create({
    method: "attachVolume",
    isInstanceUp: eq(get("State"), "attached"),
    getById,
    postCreate: ({ dependencies, lives, resolvedDependencies }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        tap(() =>
          dependencies().volume.getLive({ lives, resolvedDependencies })
        ),
      ]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#detachVolume-property
  const destroy = client.destroy({
    pickId: pick(["VolumeId"]),
    extraParam: { Force: true },
    method: "detachVolume",
    config,
    getById,
    ignoreErrorCodes,
  });

  const configDefault = ({
    name,
    namespace,
    properties = {},
    dependencies: { volume, instance },
  }) =>
    pipe([
      tap(() => {
        assert(volume, "VolumeAttachment is missing the dependency 'volume'");
        assert(
          instance,
          "VolumeAttachment is missing the dependency 'instance'"
        );
      }),
      () => properties,
      defaultsDeep({
        InstanceId: getField(instance, "InstanceId"),
        VolumeId: getField(volume, "VolumeId"),
      }),
    ])();

  const isOurMinion = () => isOurMinion;
  const managedByOther = () => () => false;

  return {
    spec,
    findId,
    findName,
    getByName,
    getById,
    getList,
    create,
    destroy,
    configDefault,
    managedByOther,
    isOurMinion,
  };
};
