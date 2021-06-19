exports.subNetworkTpl = ({ resourceVarName, resourceName, dependencies }) => `
const ${resourceVarName} = await provider.makeSubNetwork({
  name: "${resourceName}",
  dependencies: { network },
  properties: () => ({
    ipCidrRange: "10.164.0.0/20",
  }),
});
`;
