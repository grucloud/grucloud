exports.vpcCodeTpl = ({
  resourceVarName,
  resource: { name, namespace, live },
}) => `
const ${resourceVarName} = provider.ec2.makeVpc({
  name: config.${resourceVarName}.name,${
  namespace ? `\nnamespace: ${namespace}` : ""
}
  properties: () => config.${resourceVarName}.properties,
});
`;
