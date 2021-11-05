const createResources = ({ provider }) => {
  provider.compute.makeVmInstance({
    name: "instance-1",
    properties: ({ config }) => ({
      machineType: "e2-micro",
      sourceImage:
        "projects/debian-cloud/global/images/debian-10-buster-v20211028",
    }),
  });
};

exports.createResources = createResources;
