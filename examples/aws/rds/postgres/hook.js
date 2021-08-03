const assert = require("assert");
const path = require("path");
const { Client } = require("pg");

// psql postgresql://postgres:peggywenttothemarket@db-instance.cwzy9iilw73e.eu-west-2.rds.amazonaws.com:5432

module.exports = ({ resources: { dbInstance }, provider }) => {
  return {
    onDeployed: {
      init: async () => {
        const dbInstanceLive = await dbInstance.getLive();
        assert(dbInstanceLive);
        assert(process.env.MASTER_USER_PASSWORD);

        const client = new Client({
          user: dbInstanceLive.MasterUsername,
          host: dbInstanceLive.Endpoint.Address,
          //database: "dev",
          password: process.env.MASTER_USER_PASSWORD,
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
              //TODO client disconnnect
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
