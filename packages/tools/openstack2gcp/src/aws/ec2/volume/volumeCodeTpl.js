exports.volumeCodeTpl = ({
  resourceVarName,
  resource: { name, namespace },
}) => `const ${resourceVarName} = provider.ec2.makeVolume({
  name: config.${resourceVarName}.name,${
  namespace ? `\nnamespace: ${namespace}` : ""
}
  properties: () => config.${resourceVarName}.properties,
});
`;
