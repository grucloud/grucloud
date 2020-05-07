var AWS = require("aws-sdk");
const _ = require("lodash");
const assert = require("assert");
const logger = require("logger")({ prefix: "AwsClientEC2" });
const toString = (x) => JSON.stringify(x, null, 4);

module.exports = AwsClientEc2 = ({ config }) => {
  logger.info(`${toString(config)}`);

  AWS.config.apiVersions = {
    ec2: "2016-11-15",
  };

  // TODO region from config
  AWS.config.update({ region: "eu-west-2" });

  var ec2 = new AWS.EC2();

  const getById = async ({ id }) => {
    logger.debug(`getById ${toString({ id })}`);
    const all = list();
    // TODO check that

    const instance = all.find((item) => item.Instances[0].InstanceId === id);
    logger.debug(`getById result ${toString({ instance })}`);
    return instance;
  };

  const getByName = async ({ name }) => {
    logger.info(`getByName ${name}`);
    const all = await list();

    const findTagName = (tags = []) =>
      tags.find((tag) => tag.Key === "name" && tag.Value === name);

    const instance = all.Reservations.find((item) =>
      findTagName(item.Instances[0].Tags)
    );
    logger.debug(`getByName result ${toString({ instance })}`);
    return instance.Instances[0];
  };

  const create = async ({ name, payload }) => {
    logger.debug(`create ${name}, payload: ${toString(payload)}`);

    const params = {
      BlockDeviceMappings: [
        {
          DeviceName: "/dev/sdh",
          Ebs: {
            VolumeSize: 100,
          },
        },
      ],
      ImageId: "ami-0917237b4e71c5759", // Ubuntu 20.04
      InstanceType: "t2.micro",
      KeyName: "gc",
      MaxCount: 1,
      MinCount: 1,
      //SecurityGroupIds: ["sg-1a2b3c4d"],
      //SubnetId: "subnet-6e7f829e",
      TagSpecifications: [
        {
          ResourceType: "instance",
          Tags: [
            {
              Key: "name",
              Value: name,
            },
          ],
        },
      ],
    };
    const data = await ec2.runInstances(params).promise();
    console.log(`${toString(data)}`);
    return data.Instances[0];
  };

  const list = async () => {
    logger.debug(`list`);
    const data = await ec2.describeInstances().promise();
    console.log(toString(data));
    return data;
  };

  const destroy = async ({ id, name }) => {
    logger.debug(`destroy ${toString({ name, id })}`);
    if (_.isEmpty(id)) {
      throw Error(`destroy invalid id`);
    }

    await ec2
      .terminateInstances({
        InstanceIds: [id],
      })
      .promise();
  };

  return {
    ec2,
    getById,
    getByName,
    create,
    destroy,
    list,
  };
};
