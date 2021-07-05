exports.vpcCodeTpl = ({
  resourceVarName,
  resource: { name, namespace, live },
}) => `
const ${resourceVarName} = provider.ec2.makeVpc({
  name: "${name}",${namespace ? `\nnamespace: ${namespace}` : ""}
  properties: () => config.${resourceVarName}.properties,
});
`;
