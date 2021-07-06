exports.instanceConfigTpl = ({
  resourceVarName,
  resource: { name, live },
}) => `${resourceVarName}: {
  name: "${name}",
  properties: { 
    InstanceType: "${live.InstanceType}",
    ImageId: "${live.ImageId}",
  },
},`;
