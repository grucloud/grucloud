exports.virtualMachineTpl = ({
  resourceVarName,
  resourceName,
  properties: { diskSizeGb, machineType, sourceImage },
  dependencies: { subNetwork, disks = [] },
}) => `
const ${resourceVarName} = provider.compute.makeVmInstance({
  name: "${resourceName}",
  dependencies: {subNetwork: ${subNetwork}, disks: [${disks.join(",")}] },
  properties: () => ({
    diskSizeGb: "${diskSizeGb}",
    machineType: "${machineType}",
    sourceImage: "${sourceImage}",
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
