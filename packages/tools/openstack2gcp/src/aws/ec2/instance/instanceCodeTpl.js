exports.instanceCodeTpl = ({
  resourceVarName,
  dependencies: {
    subnet,
    keyPair,
    securityGroups,
    iamInstanceProfile,
    volumes,
  },
  resource: { name, namespace },
}) => `const ${resourceVarName} = provider.ec2.makeSubnet({
  name: config.${resourceVarName}.name,${
  namespace ? `\nnamespace: ${namespace}` : ""
}
  dependencies: { 
    subnet: ${subnet},
    ${keyPair ? `keyPair: ${keyPair},` : ""}
    securityGroups: [${securityGroups}],
    ${iamInstanceProfile ? `iamInstanceProfile: ${iamInstanceProfile},` : ""}
    volumes: [${volumes}]
  },
  properties: () => config.${resourceVarName}.properties,
});
`;
