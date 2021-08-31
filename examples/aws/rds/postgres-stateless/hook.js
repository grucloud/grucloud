const assert = require("assert");
const path = require("path");
const { retryCall } = require("@grucloud/core").Retry;
const Client = require("ssh2").Client;

// ssh ec2-user@18.130.101.5
// sudo yum install docker
// sudo service docker start
// sudo docker pull postgres
// sudo docker run -it postgres psql postgres://postgres:peggywenttothemarket@cluster-postgres-stateless.cluster-cwzy9iilw73e.eu-west-2.rds.amazonaws.com -c "select 1"

const commandFactory = (connection) => (command) => {
  return new Promise((resolve, reject) => {
    //console.log(command);
    connection.exec(command, { pty: true }, function (error, stream) {
      if (error) {
        console.error(error);
        return reject(error);
      }
      stream.on("data", (response) => {
        const responseStr = response.toString();
        console.log(responseStr);
      });
      stream.on("end", (response) => {
        response && console.log(response);
        resolve();
      });
    });
  });
};
//TODO read key name from config
const readPrivateKey = ({ keyName }) =>
  require("fs").readFileSync(path.resolve(__dirname, `${keyName}.pem`));

const sshConnect = async ({ host, username = "ec2-user", keyName }) =>
  await new Promise((resolve, reject) => {
    const conn = new Client();
    conn
      .on("ready", function () {
        //console.log(`ssh to ${host} ok`);
        resolve(conn);
      })
      .on("error", function (error) {
        // console.log(`cannot ssh to ${host}`, error);
        reject(error);
      })
      .connect({
        host,
        port: 22,
        username,
        //agent: process.env.SSH_AUTH_SOCK,
        privateKey: readPrivateKey({ keyName }),
      });
  });

module.exports = ({
  resources: {
    RDS: { dbCluster },
    bastion: { ec2Instance },
  },
  provider,
}) => {
  return {
    onDeployed: {
      init: async () => {
        assert(dbCluster);
        assert(ec2Instance);
        const dbClusterLive = await dbCluster.getLive();
        const ec2InstanceLive = await ec2Instance.getLive();
        const connectionString = `postgres://${process.env.MASTER_USERNAME}:${process.env.MASTER_USER_PASSWORD}@${dbClusterLive.Endpoint}`;
        return {
          dbClusterLive,
          ec2InstanceLive,
          connectionString,
        };
      },
      actions: [
        {
          name: "postgres",
          command: async ({ connectionString, ec2InstanceLive }) => {
            const host = ec2InstanceLive.PublicIpAddress;
            await retryCall({
              name: `ssh ${host}`,
              fn: async () => {
                const connection = await sshConnect({
                  host,
                  keyName: provider.config.keyPair.name,
                });
                const command = commandFactory(connection);
                await command("sudo yum -y install docker");
                await command("sudo service docker start");
                await command("sudo docker pull postgres");
                await command(
                  `sudo docker run -it postgres psql ${connectionString} -c "select 1"`
                );
                connection.end();
                return true;
              },
              shouldRetryOnException: () => true,
              config: { retryCount: 40, retryDelay: 5e3 },
            });
          },
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
