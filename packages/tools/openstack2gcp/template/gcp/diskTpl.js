exports.diskTpl = ({ resourceVarName, resourceName }) => `
const ${resourceVarName} = await provider.makeDisk({
  name: "${resourceName}",
  properties: () => ({  }),
});
`;
