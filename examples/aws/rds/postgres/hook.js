const assert = require("assert");
const path = require("path");
const { Client } = require("pg");
const { retryCall } = require("@grucloud/core").Retry;

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
        await retryCall({
          name: `postgres connect`,
          fn: async () => {
            await client.connect();
            return true;
          },
          shouldRetryOnException: () => true,
          config: { retryCount: 40, retryDelay: 5e3 },
        });

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
