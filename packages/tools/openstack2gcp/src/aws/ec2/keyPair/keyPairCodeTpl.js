exports.keyPairCodeTpl = ({
  resourceVarName,
  resource: { name, namespace },
}) => `const ${resourceVarName} = provider.ec2.useKeyPair({
  name: "${name}",${namespace ? `\nnamespace: ${namespace}` : ""}
});
`;
