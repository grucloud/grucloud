exports.vpcCodeTpl = ({
  resourceVarName,
  resource: { name, namespace, live },
}) => `
const ${resourceVarName} = provider.ec2.makeVpc({
  name: "${name}",${namespace ? `\nnamespace: ${namespace}` : ""}
  properties: () => ({ 
    CidrBlock: "${live.CidrBlock}",
    DnsSupport: ${live.DnsSupport},
    DnsHostnames: ${live.DnsHostnames}
  }),
});
`;
