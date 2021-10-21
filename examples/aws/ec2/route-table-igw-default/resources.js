const createResources = ({ provider }) => {
  provider.EC2.useDefaultInternetGateway({
    name: "default",
  });

  provider.EC2.useDefaultRouteTable({
    name: "rt-default-vpc-default",
  });

  provider.EC2.makeRoute({
    name: "rt-default-vpc-default-igw",
    properties: ({ config }) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({ resources }) => ({
      routeTable: resources.EC2.RouteTable.rtDefaultVpcDefault,
      ig: resources.EC2.InternetGateway.default,
    }),
  });
};

exports.createResources = createResources;
