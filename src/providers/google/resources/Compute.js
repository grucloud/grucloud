const GoogleClient = require("../GoogleClient");

const type = "compute";

module.exports = ({ name, provider }, config) => {
  const { project, zone } = config;
  const client = GoogleClient({
    config,
    url: `/projects/${project}/zones/${zone}/instances/`,
    onResponse: (data) => {
      console.log("AAAAAAAAAAAAAAA", JSON.stringify(data, null, 4));
      return { items: [] };
    },
  });

  const plan = async (resource) => {
    try {
      return [];
    } catch (ex) {
      console.log(`resource ${resource.name} not found `);
      return [
        {
          action: "CREATE",
          resource,
        },
      ];
    }
  };

  return {
    name,
    type,
    client,
    provider,
    create: async (name, config) => {
      const machineTypeFull = `zones/${zone}/machineTypes/${config.machineType}`;
      /*this.gceImages.getLatest(body.os, function(err, image) {
        if (err) {
          callback(err);
          return;
        }
        delete body.os;
        body.disks = body.disks || [];
        body.disks.push({
          autoDelete: true,
          boot: true,
          initializeParams: {
            sourceImage: image.selfLink,
          },
        });
        self.createVM(name, body, callback);
      }); */

      await client.create({ name, ...config, machineType: machineTypeFull });
    },
    plan,
  };
};
