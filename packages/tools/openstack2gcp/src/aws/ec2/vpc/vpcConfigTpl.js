exports.vpcConfigTpl = ({
  resourceVarName,
  resource: { name, live },
}) => `${resourceVarName}: {
  name: "${name}",
  properties: { 
    CidrBlock: "${live.CidrBlock}",
    DnsSupport: ${live.DnsSupport},
    DnsHostnames: ${live.DnsHostnames}
  },
},`;
