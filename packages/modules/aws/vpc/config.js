module.exports = ({ region }) => ({
  vpc: {
    vpc: { name: "vpc", CidrBlock: "192.168.0.0/16" },
    internetGateway: { name: "internet-gateway" },
    eip: { name: "eip" },
    subnets: {
      publicTags: [],
      publics: [
        {
          name: "subnet-public-1",
          CidrBlock: "192.168.0.0/19",
          AvailabilityZone: `${region}a`,
        },
        {
          name: "subnet-public-2",
          CidrBlock: "192.168.32.0/19",
          AvailabilityZone: `${region}b`,
        },
      ],
      privateTags: [],
      privates: [
        {
          name: "subnet-private-1",
          CidrBlock: "192.168.96.0/19",
          AvailabilityZone: `${region}a`,
        },
        {
          name: "subnet-private-2",
          CidrBlock: "192.168.128.0/19",
          AvailabilityZone: `${region}b`,
        },
      ],
    },
  },
});
