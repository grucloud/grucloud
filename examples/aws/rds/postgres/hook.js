const assert = require("assert");
const path = require("path");
const { retryCall } = require("@grucloud/core").Retry;

// psql --host=cluster.cluster-cwzy9iilw73e.eu-west-2.rds.amazonaws.com --port=5432 --username=postgres --password --dbname=dev

// dbCluster
module.exports = ({ resources: { dbCluster }, provider }) => {
  return {
    onDeployed: {
      init: async () => {
        const dbClusterLive = await dbCluster.getLive();
        return {
          dbClusterLive,
        };
      },
      actions: [
        {
          name: "postgres",
          command: async ({ dbClusterLive }) => {},
        },
      ],
    },
    onDestroyed: {
      init: () => {
        //console.log("ec2 onDestroyed");
      },
    },
  };
};
