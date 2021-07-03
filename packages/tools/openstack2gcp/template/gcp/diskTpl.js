exports.diskTpl = ({ resourceVarName, resourceName }) => `
const ${resourceVarName} = provider.compute.makeDisk({
  name: "${resourceName}",
  properties: () => ({  }),
});
`;
