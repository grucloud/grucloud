exports.subnetCodeTpl = ({
  resourceVarName,
  dependencies: { vpc },
  resource: { name, live, namespace },
}) => `const ${resourceVarName} = provider.ec2.makeSubnet({
  name: config.${resourceVarName}.name,${
  namespace ? `\nnamespace: ${namespace}` : ""
}
  dependencies: { vpc: ${vpc} },
  attributes: () => config.${resourceVarName}.attributes,
  properties: () => config.${resourceVarName}.properties,
});
`;
