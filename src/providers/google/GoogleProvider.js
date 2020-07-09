const assert = require("assert");
const fs = require("fs");
const _ = require("lodash");
const { JWT } = require("google-auth-library");
const CoreProvider = require("../CoreProvider");
const logger = require("../../logger")({ prefix: "GoogleProvider" });
const GoogleTag = require("./GoogleTag");
const compare = require("../../Utils").compare;
const { tos } = require("../../tos");

const GcpProject = require("./resources/GcpProject");
const GcpVpc = require("./resources/GcpVpc");
const GcpSubNetwork = require("./resources/GcpSubNetwork");
const GoogleVmInstance = require("./resources/GoogleVmInstance");
const GcpAddress = require("./resources/GcpAddress");

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
      type: "Vpc",
      //dependsOn: ["Project"],
      Client: ({ spec }) =>
        GcpVpc({
          spec,
          config,
        }),
      isOurMinion,
    },
    {
      type: "SubNetwork",
      dependsOn: ["Vpc"],
      Client: ({ spec }) =>
        GcpSubNetwork({
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
      dependsOn: [/*"Project", */ "Address", "Vpc"],
      Client: ({ spec }) =>
        GoogleVmInstance({
          spec,
          config,
        }),
      propertiesDefault: {
        machineType: "f1-micro",
        diskSizeGb: "10",
        diskTypes: "pd-standard",
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

  const client = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  const accessToken = await new Promise((resolve, reject) => {
    client.authorize((err, response) => {
      if (response.access_token) {
        resolve(response.access_token);
      }
      reject(err);
    });
  });
  return accessToken;
};

module.exports = GoogleProvider = async ({ name, config }) => {
  checkEnv(["GOOGLE_APPLICATION_CREDENTIALS"]);

  const accessToken = await authorize({
    applicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });

  const configProviderDefault = {
    //rename manageByTag ?
    tag: "-managed-by-gru",
    managedByKey: "managed-by",
    managedByValue: "grucloud",
    managedByDescription: "Managed By GruCloud",
    accessToken,
  };

  const core = CoreProvider({
    type: "google",
    name,
    mandatoryEnvs: ["GOOGLE_APPLICATION_CREDENTIALS"],
    mandatoryConfigKeys: ["project", "region", "zone"],
    config: _.defaults(config, configProviderDefault),
    fnSpecs,
  });

  return core;
};
