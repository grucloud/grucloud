exports.keyPairConfigTpl = ({
  resourceVarName,
  resource: { name, live },
}) => `${resourceVarName}: {
  name: "${name}",
},`;
