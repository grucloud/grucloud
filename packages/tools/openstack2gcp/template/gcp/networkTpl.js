exports.networkTpl = ({ resourceVarName, resourceName }) => `
const ${resourceVarName} = provider.compute.makeNetwork({
  name: "${resourceName}",
  properties: () => ({ autoCreateSubnetworks: false }),
});
`;
