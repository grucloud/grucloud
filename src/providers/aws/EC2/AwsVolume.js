const {
  get,
  switchCase,
  tryCatch,
  pipe,
  tap,
  eq,
  omit,
  not,
} = require("rubico");
const { isEmpty, defaultsDeep, first } = require("rubico/x");
const assert = require("assert");
const logger = require("../../../logger")({ prefix: "AwsVolume" });
const { retryCall } = require("../../Retry");

const { tos } = require("../../../tos");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");
const {
  Ec2New,
  findNameInTagsOrId,
  shouldRetryOnException,
  getByIdCore,
  buildTags,
} = require("../AwsCommon");

exports.AwsVolume = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const ec2 = Ec2New(config);

  const findId = get("VolumeId");
  const findName = (item) => findNameInTagsOrId({ item, findId });

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

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });
  const getById = getByIdCore({ fieldIds: "VolumeIds", getList });

  const isUpById = isUpByIdCore({
    isInstanceUp: eq(get("State"), "available"),
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
      () => ec2().deleteVolume({ VolumeId: id }),
      tap(() =>
        retryCall({
          name: `destroy volume isDownById: ${name} id: ${id}`,
          fn: () => isDownById({ id }),
          config,
        })
      ),
      tap((result) => {
        logger.info(`volume destroyed ${JSON.stringify({ name, id })}`);
      }),
    ])();

  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({
      Size: 10,
      Device: "/dev/sdf",
      AvailabilityZone: config.zone(),
      VolumeType: "standard",
      TagSpecifications: [
        {
          ResourceType: "volume",
          Tags: buildTags({ config, name }),
        },
      ],
    })(properties);

  const cannotBeDeleted = pipe([
    get("resource.Attachments"),
    first,
    get("DeleteOnTermination"),
  ]);

  return {
    type: "Volume",
    spec,
    findId,
    isUpById,
    isDownById,
    getByName,
    getById,
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
