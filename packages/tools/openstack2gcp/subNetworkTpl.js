exports.subNetworkTpl = ({
  resourceVarName,
  resourceName,
  dependencyNames,
  resource,
}) => `
const ${resourceVarName} = await provider.makeSubNetwork({
  name: "${resourceName}",
  dependencies: { ${dependencyNames.join(",")} },
  properties: () => ({
    ipCidrRange: "${resource.live.cidr}",
  }),
});
`;
