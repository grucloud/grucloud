exports.subNetworkTpl = ({
  resourceVarName,
  resourceName,
  dependencies: { network },
  resource,
}) => `
const ${resourceVarName} = provider.ec2.makeSubnetwork({
  name: "${resourceName}",
  dependencies: { network: ${network} },
  properties: () => ({
    ipCidrRange: "${resource.live.cidr}",
  }),
});
`;
