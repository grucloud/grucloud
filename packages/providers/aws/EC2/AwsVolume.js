const {
  get,
  switchCase,
  tryCatch,
  pipe,
  not,
  tap,
  eq,
  omit,
} = require("rubico");
const { isEmpty, defaultsDeep, first, identity, find } = require("rubico/x");
const assert = require("assert");
const logger = require("@grucloud/core/logger")({ prefix: "AwsVolume" });
const { retryCall } = require("@grucloud/core/Retry");
const { AwsEC2 } = require("./AwsEC2");

const { tos } = require("@grucloud/core/tos");
const {
  getByNameCore,
  isUpByIdCore,
  isDownByIdCore,
} = require("@grucloud/core/Common");
const {
  Ec2New,
  findNameInTagsOrId,
  shouldRetryOnException,
  getByIdCore,
  buildTags,
  findNamespaceInTags,
} = require("../AwsCommon");

exports.AwsVolume = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const ec2 = Ec2New(config);

  const awsEC2 = AwsEC2({ config, spec });

  const findId = get("live.VolumeId");
  const findName = findNameInTagsOrId({ findId });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVolumes-property
  const getList = ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList volume ${JSON.stringify({ params })}`);
      }),
      () => ec2().describeVolumes(params),
      get("Volumes"),
      tap((items) => {
        logger.debug(`getList volume result: ${tos(items)}`);
      }),
      (items) => ({
        total: items.length,
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList #volume ${total}`);
      }),
    ])();

  const getByName = getByNameCore({ getList, findName });
  const getById = getByIdCore({ fieldIds: "VolumeIds", getList });
  const isInstanceUp = eq(get("State"), "available");
  const isUpById = isUpByIdCore({
    isInstanceUp,
    getById,
  });

  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createVolume-property

  const create = async ({ payload, name }) =>
    pipe([
      tap(() => {
        logger.info(`create volume ${tos({ name })}`);
        logger.debug(tos({ payload }));
      }),
      () => ec2().createVolume(omit(["Device"])(payload)),
      tap((result) => {
        logger.info(`created volume ${tos({ result })}`);
      }),
      ({ VolumeId }) =>
        retryCall({
          name: `volume is available: ${name} VolumeId: ${VolumeId}`,
          fn: () => isUpById({ name, id: VolumeId }),
          config,
        }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteVolume-property
  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.info(`destroy volume ${JSON.stringify({ name, id })}`);
      }),
      tryCatch(
        () => ec2().deleteVolume({ VolumeId: id }),
        tap.if(not(eq(get("code"), "InvalidVolume.NotFound")), (error) => {
          throw error;
        })
      ),
      tap(() =>
        retryCall({
          name: `destroy volume isDownById: ${name} id: ${id}`,
          fn: () => isDownById({ id }),
          config,
        })
      ),
      tap(() => {
        logger.info(`volume destroyed ${JSON.stringify({ name, id })}`);
      }),
    ])();

  const configDefault = async ({ name, namespace, properties, dependencies }) =>
    defaultsDeep({
      Size: 10,
      Device: "/dev/sdf",
      AvailabilityZone: config.zone(),
      VolumeType: "standard",
      TagSpecifications: [
        {
          ResourceType: "volume",
          Tags: buildTags({ config, namespace, name }),
        },
      ],
    })(properties);

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
          type: "EC2",
          providerName: config.providerName,
        }),
      find(eq(get("live.InstanceId"), findInstanceId(live))),
      switchCase([
        isEmpty,
        identity,
        ({ live }) => awsEC2.findNamespace({ live, lives }),
      ]),
      tap((namespace) => {
        logger.debug(`findNamespaceFromInstanceId ${namespace}`);
      }),
    ])();

  const findNamespace = ({ live, lives }) =>
    pipe([
      () => findNamespaceInTags(config)({ live }),
      switchCase([
        isEmpty,
        () => findNamespaceFromInstanceId({ live, lives }),
        identity,
      ]),
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
    shouldRetryOnException,
    cannotBeDeleted,
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
