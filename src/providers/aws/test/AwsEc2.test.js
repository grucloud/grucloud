/*var AWS = require("aws-sdk");
const _ = require("lodash");
const assert = require("assert");
const logger = require("logger")({ prefix: "AwsEc2" });
const toJSON = (x) => JSON.stringify(x, null, 4);

AWS.config.apiVersions = {
  ec2: "2016-11-15",
};

AWS.config.update({ region: "eu-west-2" });

var ec2 = new AWS.EC2();

describe.skip("AwsEc2", async function () {
  it("describeInstances", async function () {
    const data = await ec2.describeInstances().promise();
    console.log(toJSON(data));
  });
  it.skip("keyPair", async function () {
    var params = {
      KeyName: "my-key-pair",
    };
    const result = await ec2.describeKeyPairs().promise();

    //TODO got duplicated ket event for a new Key
    const keyPair = await ec2.createKeyPair(params).promise();
  });
  it.only("runInstances", async function () {
    const KeyName = "gc";

    const result = await ec2.describeKeyPairs().promise();
    assert(
      result.KeyPairs.find((kp) => kp.KeyName === KeyName),
      "create a key pair first"
    );
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
              Value: "myname",
            },
          ],
        },
      ],
    };

    const data = await ec2.runInstances(params).promise();
    assert(data.ReservationId);
    {
      const data = await ec2.describeInstances().promise();
      console.log(toJSON(data));
    }
    {
      await ec2
        .terminateInstances({
          InstanceIds: [data.ReservationId],
        })
        .promise();
    }
  });
});
*/
