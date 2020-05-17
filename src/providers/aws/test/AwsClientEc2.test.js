const _ = require("lodash");
const assert = require("assert");
const logger = require("logger")({ prefix: "AwsClientEc2" });
const toJSON = (x) => JSON.stringify(x, null, 4);

const AwsClientEc2 = require("../AwsClientEC2");
const config = require("./config");

describe.skip("AwsClientEc2", async function () {
  let clientEc2;
  before(async () => {
    clientEc2 = AwsClientEc2({ config });
  });

  it("create", async function () {
    const list = await clientEc2.list();
    assert(list);
    const KeyName = "gc";
    const name = "ec2Name";

    const result = await clientEc2.ec2.describeKeyPairs().promise();
    assert(
      result.KeyPairs.find((kp) => kp.KeyName === KeyName),
      "create a key pair first"
    );

    const payload = {
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
    await clientEc2.create({ name, payload });
  });
});
