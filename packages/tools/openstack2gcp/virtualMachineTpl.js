exports.virtualMachineTpl = ({
  resourceVarName,
  resourceName,
  properties: { diskSizeGb = 20 },
  dependencies: { subNetwork, disks = [] },
}) => `
const ${resourceVarName} = await provider.makeVmInstance({
  name: "${resourceName}",
  dependencies: {subNetwork: ${subNetwork}, disks: [${disks.join(",")}] },

  properties: () => ({
    diskSizeGb: "${diskSizeGb}",
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
