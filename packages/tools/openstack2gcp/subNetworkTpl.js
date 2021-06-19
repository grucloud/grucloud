exports.subNetworkTpl = ({
  resourceVarName,
  resourceName,
  dependencies: { network },
  resource,
}) => `
const ${resourceVarName} = await provider.makeSubNetwork({
  name: "${resourceName}",
  dependencies: { network: ${network} },
  properties: () => ({
    ipCidrRange: "${resource.live.cidr}",
  }),
});
`;
