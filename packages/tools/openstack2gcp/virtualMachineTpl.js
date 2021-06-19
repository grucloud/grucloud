exports.virtualMachineTpl = ({
  resourceVarName,
  resourceName,
  dependencyNames,
}) => `
const ${resourceVarName} = await provider.makeVmInstance({
  name: "${resourceName}",
  dependencies: { ${dependencyNames.join(",")} },

  properties: () => ({
    diskSizeGb: "20",
    machineType: "f1-micro",
    sourceImage:
      "projects/ubuntu-os-cloud/global/images/family/ubuntu-2004-lts",
    metadata: {
      items: [
        {
          key: "enable-oslogin",
          value: "True",
        },
      ],
    },
  }),
});

`;
