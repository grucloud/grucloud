const assert = require("assert");
const path = require("path");
const { Client } = require("pg");

// dbCluster
module.exports = ({ resources: { dbInstance }, provider }) => {
  return {
    onDeployed: {
      init: async () => {
        const dbInstanceLive = await dbInstance.getLive();

        const client = new Client({
          user: dbInstanceLive.MasterUsername,
          host: dbInstanceLive.Endpoint.Address,
          //database: "dev",
          password: "peggywenttothemarket",
          port: dbInstanceLive.Endpoint.Port,
        });

        await client.connect();
        return {
          client,
          dbInstanceLive,
        };
      },
      actions: [
        {
          name: "create database",
          command: async ({ client }) => {
            const db = "dbdev";
            try {
              await client.query(`CREATE DATABASE ${db}`);
            } catch (error) {
              if (error.message !== `database "${db}" already exists`) {
                throw error;
              }
            }
          },
        },
      ],
    },
    onDestroyed: {
      init: () => {},
    },
  };
};
