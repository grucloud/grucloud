exports.subnetTpl = ({
  resourceVarName,
  dependencies: { vpc },
  resource: { name, live, namespace },
}) => `
const ${resourceVarName} = provider.ec2.makeSubnet({
  name: "${name}",${namespace ? `\nnamespace: ${namespace}` : ""}
  dependencies: { vpc: ${vpc} },
  attributes: () => ({
    ${
      live.MapPublicIpOnLaunch
        ? `MapPublicIpOnLaunch: {
      Value: true,
    },`
        : ""
    }
  }),
  properties: () => ({
    CidrBlock: "${live.CidrBlock}",
  }),
});
`;
