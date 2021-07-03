exports.diskTpl = ({ resourceVarName, resourceName }) => `
const ${resourceVarName} = await provider.compute.makeDisk({
  name: "${resourceName}",
  properties: () => ({  }),
});
`;
