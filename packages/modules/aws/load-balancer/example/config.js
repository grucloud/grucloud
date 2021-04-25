module.exports = ({ region }) => ({
  projectName: "load-balancer-example",
  certificate: {
    rootDomainName: "grucloud.org",
    domainName: "mod-aws-load-balancer.grucloud.org",
  },
  vpc: {
    vpc: { name: `vpc-module-load-balancer`, CidrBlock: "192.168.0.0/16" },
    internetGateway: { name: `internet-gateway` },
    routeTablePublic: { name: `route-table-public` },
    routePublic: { name: `route-public` },
    subnets: {
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
    },
  },
});
