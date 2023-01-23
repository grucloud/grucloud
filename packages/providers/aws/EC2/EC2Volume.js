const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  omit,
  eq,
  or,
  any,
  switchCase,
  assign,
} = require("rubico");
const { defaultsDeep, first, unless, prepend, isEmpty } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const { findLiveById } = require("@grucloud/core/generatorUtils");

const {
  buildTags,
  hasKeyInTags,
  findNameInTagsOrId,
  findValueInTags,
} = require("../AwsCommon");
const {
  tagResource,
  untagResource,
  buildAvailabilityZone,
} = require("./EC2Common");

const findId = () =>
  pipe([
    get("VolumeId"),
    tap((id) => {
      assert(id);
    }),
  ]);

const managedByOther = ({ lives, config }) =>
  or([
    hasKeyInTags({
      key: "kubernetes.io/cluster/",
    }),
    pipe([
      tap(() => {
        assert(lives);
      }),
      get("Attachments", []),
      any(({ Device, InstanceId }) =>
        pipe([
          () => InstanceId,
          lives.getById({
            providerName: config.providerName,
            type: "Instance",
            group: "EC2",
          }),
          tap((instance) => {
            //assert(instance, `cannot find ec2 instanceId: ${InstanceId}`);
          }),
          eq(get("live.RootDeviceName"), Device),
        ])()
      ),
    ]),
  ]);

const cannotBeDeleted = () =>
  pipe([get("Attachments"), first, get("DeleteOnTermination")]);

const findInstanceId = pipe([get("Attachments"), first, get("InstanceId")]);

const findNamespaceFromInstanceId = ({ live, lives }) =>
  pipe([
    lives.getByType({
      type: "Instance",
      group: "EC2",
      providerName: config.providerName,
    }),
    find(eq(get("live.InstanceId"), findInstanceId(live))),
    unless(
      isEmpty,
      pipe([
        tap(({ live }) => {
          assert(live);
        }),
        ({ live }) => awsEC2.findNamespace({ live, lives }),
      ])
    ),
    tap((namespace) => {
      logger.debug(`findNamespaceFromInstanceId ${namespace}`);
    }),
  ])();

const findNamespace =
  ({ lives, config }) =>
  (live) =>
    pipe([
      () => live,
      findNamespaceInTags({ live, config }),
      when(isEmpty, () => findNamespaceFromInstanceId({ lives, config })(live)),
      tap((namespace) => {
        logger.debug(`findNamespace`, namespace);
      }),
    ])();

const findNameKubernetes = ({ lives, config }) =>
  pipe([
    switchCase([
      managedByOther({ lives, config }),
      pipe([
        tap((params) => {
          assert(true);
        }),
        findValueInTags({ key: "kubernetes.io/created-for/pvc/name" }),
        tap((pvcName) => {
          //assert(pvcName);
        }),
        unless(isEmpty, prepend("kubernetes-")),
      ]),
      () => undefined,
    ]),
  ]);

const findNameEC2 = ({ lives, config }) =>
  switchCase([
    managedByOther({ lives, config }),
    pipe([
      get("Attachments"),
      first,
      get("InstanceId"),
      lives.getById({
        providerName: config.providerName,
        type: "Instance",
        group: "EC2",
      }),
      get("name"),
      prepend("vol-"),
    ]),
    () => undefined,
  ]);

const findName = (params) => (live) => {
  const fns = [findNameKubernetes, findNameEC2, findNameInTagsOrId({ findId })];
  for (fn of fns) {
    const name = fn(params)(live);
    if (!isEmpty(name)) {
      return name;
    }
  }
  assert(false, "should have a name");
};

const setupEbsVolume = ({
  deviceMounted = "/dev/xvdf",
  mountPoint = "/data",
}) => `#!/bin/bash
echo "Mounting ${deviceMounted}"
while ! ls ${deviceMounted} > /dev/null
do 
  sleep 1
done
if [ \`file -s ${deviceMounted} | cut -d ' ' -f 2\` = 'data' ]
then
  echo "Formatting ${deviceMounted}"
  mkfs.xfs ${deviceMounted}
fi
mkdir -p ${mountPoint}
mount ${deviceMounted} ${mountPoint}
echo ${deviceMounted} ${mountPoint} defaults,nofail 0 2 >> /etc/fstab
`;

const pickId = pipe([
  tap(({ VolumeId }) => {
    assert(VolumeId);
  }),
  pick(["VolumeId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2Volume = () => ({
  type: "Volume",
  package: "ec2",
  client: "EC2",
  findName,
  findId,
  ignoreErrorCodes: ["InvalidVolume.NotFound"],
  omitProperties: [
    "Attachments",
    "CreateTime",
    "Encrypted",
    "SnapshotId",
    "State",
    "VolumeId",
    "Device",
  ],
  propertiesDefault: {
    MultiAttachEnabled: false,
  },
  setupEbsVolume,
  filterLive: () =>
    pipe([
      assign({
        AvailabilityZone: buildAvailabilityZone,
      }),
    ]),
  //TODO do we need that ?
  ignoreResource:
    ({ lives }) =>
    (resource) =>
      pipe([
        () => resource,
        or([
          get("managedByOther"),
          pipe([
            get("live.Attachments"),
            tap((params) => {
              assert(true);
            }),
            any(({ Device, InstanceId }) =>
              pipe([
                () => InstanceId,
                findLiveById({
                  type: "Instance",
                  group: "EC2",
                  lives,
                  providerName: resource.providerName,
                }),
                eq(get("live.RootDeviceName"), Device),
              ])()
            ),
            tap((params) => {
              assert(true);
            }),
          ]),
        ]),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#getVolume-property
  getById: {
    pickId: ({ VolumeId }) => ({ VolumeIds: [VolumeId] }),
    method: "describeVolumes",
    getField: "Volumes",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#listVolumes-property
  getList: {
    method: "describeVolumes",
    getParam: "Volumes",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createVolume-property
  create: {
    filterPayload: omit(["Device"]),
    method: "createVolume",
    isInstanceUp: eq(get("State"), "available"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteVolume-property
  destroy: {
    pickId,
    method: "deleteVolume",
  },
  getByName: getByNameCore,
  tagger: () => ({ tagResource: tagResource, untagResource: untagResource }),
  cannotBeDeleted,
  managedByOther,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies,
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Size: 10,
        Device: "/dev/sdf",
        AvailabilityZone: config.zone(),
        VolumeType: "standard",
        TagSpecifications: [
          {
            ResourceType: "volume",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
    ])(),
});
