const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { tryCatch } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { JWT } = require("google-auth-library");
const expandTilde = require("expand-tilde");
const shell = require("shelljs");

const CoreProvider = require("../CoreProvider");
const logger = require("../../logger")({ prefix: "GoogleProvider" });
const GoogleTag = require("./GoogleTag");
const compare = require("../../Utils").compare;
const { tos } = require("../../tos");

const {
  GcpServiceAccount,
  isOurMinionServiceAccount,
} = require("./resources/iam/GcpServiceAccount");

//const GcpProject = require("./resources/resourcemanager/GcpProject");
const GcpNetwork = require("./resources/compute/GcpNetwork");
const GcpSubNetwork = require("./resources/compute/GcpSubNetwork");
const GcpFirewall = require("./resources/compute/GcpFirewall");
const GoogleVmInstance = require("./resources/compute/GcpVmInstance");
const GcpAddress = require("./resources/compute/GcpAddress");

const { checkEnv } = require("../../Utils");

const fnSpecs = (config) => {
  const isOurMinion = ({ resource }) =>
    GoogleTag.isOurMinion({ resource, config });

  return [
    /*{
      type: "Project",
      Client: ({ spec }) =>
        GcpProject({
          spec,
          config,
        }),
      isOurMinion,
    },*/
    {
      type: "ServiceAccount",
      Client: ({ spec }) =>
        GcpServiceAccount({
          spec,
          config,
        }),
      isOurMinion: ({ resource, resourceNames }) =>
        isOurMinionServiceAccount({ resource, resourceNames }),
    },
    {
      type: "Network",
      //dependsOn: ["Project"],
      Client: ({ spec }) =>
        GcpNetwork({
          spec,
          config,
        }),
      isOurMinion,
    },
    {
      type: "SubNetwork",
      dependsOn: ["Network"],
      Client: ({ spec }) =>
        GcpSubNetwork({
          spec,
          config,
        }),
      isOurMinion,
    },
    {
      type: "Firewall",
      dependsOn: ["Network"],
      Client: ({ spec }) =>
        GcpFirewall({
          spec,
          config,
        }),
      isOurMinion,
    },
    {
      type: "Address",
      Client: ({ spec }) =>
        GcpAddress({
          spec,
          config,
        }),
      isOurMinion,
    },
    {
      type: "VmInstance",
      dependsOn: [
        /*"Project", */ "ServiceAccount",
        "Address",
        "Network",
        "Firewall",
      ],
      Client: ({ spec }) =>
        GoogleVmInstance({
          spec,
          config,
        }),
      propertiesDefault: {
        machineType: "f1-micro",
        diskSizeGb: "10",
        diskType: "pd-standard",
        sourceImage:
          "projects/ubuntu-os-cloud/global/images/family/ubuntu-2004-lts",
      },
      compare: ({ target, live }) => {
        logger.debug(`compare server`);
        const diff = compare({
          target,
          targetKeys: [], //TODO
          live,
        });
        logger.debug(`compare ${tos(diff)}`);
        return diff;
      },
      isOurMinion,
    },
  ];
};

const authorize = async ({ applicationCredentials }) => {
  assert(applicationCredentials);
  if (!fs.existsSync(applicationCredentials)) {
    const message = `Cannot open application credentials file ${applicationCredentials}`;
    throw { code: 422, message };
  }
  const keys = require(applicationCredentials);
  logger.debug(`authorize with email: ${keys.client_email}`);

  const client = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  const accessToken = await new Promise((resolve, reject) => {
    client.authorize((err, response) => {
      if (err) {
        return reject(err);
      }
      if (response?.access_token) {
        resolve(response.access_token);
      } else {
        reject("Cannot get access_token");
      }
    });
  });
  return accessToken;
};

const getConfig = tryCatch(
  () => {
    const command = "gcloud info --format json";
    const { stdout, code } = shell.exec(command, { silent: true });
    if (code !== 0) {
      throw { message: `command '${command}' failed` };
    }
    const config = JSON.parse(stdout);
    logger.debug(`getConfig: ${tos(config)}`);
    return config;
  },
  (error) => {
    logger.error(`getConfig: ${error}`);
    throw error;
  }
);
exports.authorize = authorize;

exports.GoogleProvider = async ({ name = "google", config }) => {
  checkEnv(["GOOGLE_APPLICATION_CREDENTIALS"]);
  const applicationCredentials = path.resolve(
    process.env.CONFIG_DIR,
    expandTilde(process.env.GOOGLE_APPLICATION_CREDENTIALS)
  );
  process.env.GOOGLE_APPLICATION_CREDENTIALS = applicationCredentials;

  const localConfig = getConfig();
  const accessToken = await authorize({
    applicationCredentials,
  });

  const { region, zone } = localConfig.config.properties.compute;
  const { project } = localConfig.config;
  const configProviderDefault = {
    managedByTag: "-managed-by-gru",
    managedByKey: "managed-by",
    managedByValue: "grucloud",
    accessToken,
    project,
    region,
    zone,
  };

  const core = CoreProvider({
    type: "google",
    name,
    mandatoryEnvs: ["GOOGLE_APPLICATION_CREDENTIALS"],
    config: defaultsDeep(configProviderDefault)(config),
    fnSpecs,
  });

  return core;
};
