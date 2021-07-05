exports.subnetConfigTpl = ({
  resourceVarName,
  resource: { name, live },
}) => `${resourceVarName}: {
  name: "${name}",
  attributes: {
    MapPublicIpOnLaunch: "${live.MapPublicIpOnLaunch}"
  },
  properties: { 
    CidrBlock: "${live.CidrBlock}",
    AvailabilityZone: "${live.AvailabilityZone}",
  },
},`;
