exports.subnetConfigTpl = ({
  resourceVarName,
  resource: { name, live },
}) => `${resourceVarName}: {
  name: "${name}",
  properties: { 
    CidrBlock: "${live.CidrBlock}",
  },
},`;
