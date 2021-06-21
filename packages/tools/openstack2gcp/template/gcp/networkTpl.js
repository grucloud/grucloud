exports.networkTpl = ({ resourceVarName, resourceName }) => `
const ${resourceVarName} = await provider.makeNetwork({
  name: "${resourceName}",
  properties: () => ({ autoCreateSubnetworks: false }),
});
`;
