module.exports = ({ region }) => ({
  vpc: {
    vpc: { name: `vpc`, CidrBlock: "192.168.0.0/16" },
    internetGateway: { name: `internet-gateway` },
    eip: { name: `iep` },
    routeTablePublic: { name: `route-table-public` },
    routePublic: { name: `route-public` },
    natGateway: { name: `nat-gateway` },
    subnets: {
      publicTags: [],
      publics: [
        {
          name: `subnet-public-a`,
          CidrBlock: "192.168.0.0/19",
          AvailabilityZone: `${region}a`,
        },
        {
          name: `subnet-public-b`,
          CidrBlock: "192.168.32.0/19",
          AvailabilityZone: `${region}b`,
        },
      ],
      privateTags: [],
      privates: [
        {
          name: `subnet-private-a`,
          CidrBlock: "192.168.96.0/19",
          AvailabilityZone: `${region}a`,
          routeTableName: `route-table-private-a`,
          routeName: `route-private-a`,
        },
        {
          name: `subnet-private-b`,
          CidrBlock: "192.168.128.0/19",
          AvailabilityZone: `${region}b`,
          routeTableName: `route-table-private-b`,
          routeName: `route-private-b`,
        },
      ],
    },
  },
});
