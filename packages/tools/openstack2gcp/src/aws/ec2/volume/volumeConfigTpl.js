exports.volumeConfigTpl = ({
  resourceVarName,
  resource: { name, live },
}) => `${resourceVarName}: {
  name: "${name}",
  properties: { 
    Size: "${live.Size}",
    VolumeType: "${live.VolumeType}",
    Device: "${live.Device}",
  },
},`;
