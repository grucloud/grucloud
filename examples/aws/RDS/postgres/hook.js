const assert = require("assert");
const { pipe, tap } = require("rubico");
const path = require("path");
const { Client } = require("pg");
const { retryCall } = require("@grucloud/core").Retry;

// psql postgresql://postgres:peggywenttothemarket@db-instance.cwzy9iilw73e.eu-west-2.rds.amazonaws.com:5432

module.exports = ({ provider }) => {
  return {
    onDeployed: {
      init: async () => {
        const resources = provider.resources();
        const dbInstanceLive = await resources.RDS.DBInstance[
          "db-instance"
        ].getLive();
        assert(dbInstanceLive);
        assert(process.env.DB_INSTANCE_MASTER_USER_PASSWORD);
        assert(dbInstanceLive.Endpoint.Port);
        assert(dbInstanceLive.Endpoint.Address);

        const client = new Client({
          user: dbInstanceLive.MasterUsername,
          host: dbInstanceLive.Endpoint.Address,
          database: "postgres",
          password: process.env.DB_INSTANCE_MASTER_USER_PASSWORD,
          port: dbInstanceLive.Endpoint.Port,
        });
        client.on("error", console.error);
        await retryCall({
          name: `postgres connect`,
          fn: async () => {
            await client.connect();
            return true;
          },
          shouldRetryOnException: (error) =>
            pipe([
              tap((params) => {
                assert(error);
              }),
              () => true,
            ])(),
          config: { retryCount: 40, retryDelay: 5e3 },
        });

        return {
          client,
          dbInstanceLive,
        };
      },
      cleanUp: ({ client }) =>
        pipe([
          tap(() => {
            client.end();
          }),
        ])(),
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
