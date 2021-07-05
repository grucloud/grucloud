exports.subNetworkTpl = ({
  resourceVarName,
  resourceName,
  dependencies: { network },
  resource,
}) => `
const ${resourceVarName} = provider.compute.makeSubNetwork({
  name: "${resourceName}",
  dependencies: { network: ${network} },
  properties: () => ({
    ipCidrRange: "${resource.live.cidr}",
  }),
});
`;
