exports.networkTpl = ({ resourceVarName, resourceName }) => `
const ${resourceVarName} = await provider.compute.makeNetwork({
  name: "${resourceName}",
  properties: () => ({ autoCreateSubnetworks: false }),
});
`;
