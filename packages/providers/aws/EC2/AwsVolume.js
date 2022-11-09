const {
  get,
  switchCase,
  pipe,
  tap,
  eq,
  omit,
  or,
  any,
  pick,
} = require("rubico");
const {
  isEmpty,
  defaultsDeep,
  first,
  when,
  find,
  prepend,
  unless,
} = require("rubico/x");
const assert = require("assert");
const logger = require("@grucloud/core/logger")({ prefix: "AwsVolume" });
const { EC2Instance } = require("./EC2Instance");

const { getByNameCore } = require("@grucloud/core/Common");
const {
  findNameInTagsOrId,
  getByIdCore,
  buildTags,
  findNamespaceInTags,
  hasKeyInTags,
  findValueInTags,
} = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const { createEC2, tagResource, untagResource } = require("./EC2Common");

exports.AwsVolume = ({ spec, config }) => {
  const ec2 = createEC2(config);
  const client = AwsClient({ spec, config })(ec2);
  const awsEC2 = EC2Instance({ config, spec });

  const managedByOther = or([
    hasKeyInTags({
      key: "kubernetes.io/cluster/",
    }),
    ({ live, lives }) =>
      pipe([
        tap(() => {
          assert(lives);
        }),
        () => live,
        get("Attachments", []),
        any(({ Device, InstanceId }) =>
          pipe([
            () =>
              lives.getById({
                providerName: config.providerName,
                type: "Instance",
                group: "EC2",
                id: InstanceId,
              }),
            tap((instance) => {
              //assert(instance, `cannot find ec2 instanceId: ${InstanceId}`);
            }),
            eq(get("live.RootDeviceName"), Device),
          ])()
        ),
      ])(),
  ]);

  const findId = get("live.VolumeId");
  const pickId = pick(["VolumeId"]);

  const findNameKubernetes = switchCase([
    managedByOther,
    pipe([
      get("live"),
      findValueInTags({ key: "kubernetes.io/created-for/pvc/name" }),
      tap((pvcName) => {
        //assert(pvcName);
      }),
      unless(isEmpty, prepend("kubernetes-")),
    ]),
    () => undefined,
  ]);

  const findNameEC2 = switchCase([
    managedByOther,
    ({ live, lives }) =>
      pipe([
        () => live,
        get("Attachments"),
        first,
        ({ InstanceId }) =>
          lives.getById({
            providerName: config.providerName,
            type: "Instance",
            group: "EC2",
            id: InstanceId,
          }),
        get("name"),
        prepend("vol-"),
      ])(),
    () => undefined,
  ]);

  const findName = (params) => {
    const fns = [
      findNameKubernetes,
      findNameEC2,
      findNameInTagsOrId({ findId }),
    ];
    for (fn of fns) {
      const name = fn(params);
      if (!isEmpty(name)) {
        return name;
      }
    }
    assert(false, "should have a name");
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVolumes-property

  const getList = client.getList({
    method: "describeVolumes",
    getParam: "Volumes",
  });

  const getByName = getByNameCore({ getList, findName });

  const getById = () =>
    pipe([
      ({ VolumeId }) => ({ id: VolumeId }),
      getByIdCore({ fieldIds: "VolumeIds", getList }),
    ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createVolume-property
  const create = client.create({
    filterPayload: omit(["Device"]),
    method: "createVolume",
    isInstanceUp: eq(get("State"), "available"),
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteVolume-property
  const destroy = client.destroy({
    pickId,
    method: "deleteVolume",
    getById,
    ignoreErrorCodes: ["InvalidVolume.NotFound"],
  });

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies,
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
    ])();

  const cannotBeDeleted = pipe([
    get("live.Attachments"),
    first,
    get("DeleteOnTermination"),
  ]);

  const findInstanceId = pipe([get("Attachments"), first, get("InstanceId")]);

  const findNamespaceFromInstanceId = ({ live, lives }) =>
    pipe([
      () =>
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

  const findNamespace = ({ live, lives }) =>
    pipe([
      () => findNamespaceInTags(config)({ live }),
      when(isEmpty, () => findNamespaceFromInstanceId({ live, lives })),
      tap((namespace) => {
        logger.debug(`findNamespace`, namespace);
      }),
    ])();

  return {
    spec,
    findId,
    findNamespace,
    getByName,
    findName,
    getList,
    create,
    destroy,
    configDefault,
    cannotBeDeleted,
    managedByOther,
    tagResource: tagResource({ endpoint: ec2 }),
    untagResource: untagResource({ endpoint: ec2 }),
  };
};

exports.setupEbsVolume = ({
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
