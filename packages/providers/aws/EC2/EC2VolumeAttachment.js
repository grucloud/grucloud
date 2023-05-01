const assert = require("assert");
const { pipe, tap, get, pick, eq, map, fork } = require("rubico");
const { defaultsDeep, when, find } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");

const { compareAws } = require("../AwsCommon");

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
          get("name", live.VolumeId),
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
          get("name", live.InstanceId),
        ]),
      }),
      ({ volume, instance }) => `vol-attachment::${volume}::${instance}`,
    ])();

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2VolumeAttachment = () => ({
  type: "VolumeAttachment",
  package: "ec2",
  client: "EC2",
  findName,
  findId,
  omitProperties: [],
  ignoreErrorCodes: ["InvalidVolume.NotFound"],
  dependencies: {
    volume: {
      type: "Volume",
      group: "EC2",
      parent: true,
      dependencyId: ({ lives, config }) => get("VolumeId"),
    },
    instance: {
      type: "Instance",
      group: "EC2",
      parent: true,
      dependencyId: ({ lives, config }) => get("InstanceId"),
    },
  },
  compare: compareAws({ getLiveTags: () => [], getTargetTags: () => [] })({
    filterAll: () => pipe([pick([])]),
  }),
  inferName: ({ dependenciesSpec: { volume, instance } }) =>
    pipe([
      tap(() => {
        assert(volume);
        assert(instance);
      }),
      () => `vol-attachment::${volume}::${instance}`,
    ]),
  filterLive: () => pipe([pick(["Device", "DeleteOnTermination"])]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#getVolumeAttachment-property
  getById: {
    pickId: ({ InstanceId, VolumeId }) => ({
      VolumeIds: [VolumeId],
      Filters: [
        {
          Name: "attachment.instance-id",
          Values: [InstanceId],
        },
        // TODO
        // {
        //   Name: "tag-key",
        //   Values: [config.managedByKey],
        // },
      ],
    }),
    method: "describeVolumes",
    getField: "Volumes",
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
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#listVolumeAttachments-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
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
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createVolumeAttachment-property
  create: {
    method: "attachVolume",
    isInstanceUp: eq(get("State"), "attached"),
    postCreate: ({ dependencies, lives, resolvedDependencies }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        tap(() =>
          dependencies().volume.getLive({ lives, resolvedDependencies })
        ),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteVolumeAttachment-property
  destroy: {
    pickId: pick(["VolumeId"]),
    extraParam: { Force: true },
    method: "detachVolume",
  },
  getByName: getByNameCore,
  managedByOther: () => () => false,
  configDefault: ({
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
    ])(),
});
