const assert = require("assert");
const fs = require("fs").promises;
const path = require("path");
const os = require("os");

const {
  map,
  tryCatch,
  pipe,
  pick,
  get,
  tap,
  filter,
  switchCase,
} = require("rubico");
const {
  defaultsDeep,
  pluck,
  isEmpty,
  find,
  uniq,
  isDeepEqual,
  first,
} = require("rubico/x");
const { JWT } = require("google-auth-library");
const expandTilde = require("expand-tilde");
const shell = require("shelljs");

const CoreProvider = require("../CoreProvider");
const AxiosMaker = require("../AxiosMaker");

const logger = require("../../logger")({ prefix: "GoogleProvider" });
const { tos } = require("../../tos");

const GcpCompute = require("./resources/compute/");
const GcpIam = require("./resources/iam/");
const GcpStorage = require("./resources/storage/");
const GcpDns = require("./resources/dns/");

const computeDefault = {
  region: "europe-west4",
  zone: "europe-west4-a",
};

const servicesApis = [
  "cloudresourcemanager.googleapis.com",
  "iam.googleapis.com",
  "compute.googleapis.com",
  "serviceusage.googleapis.com",
  "dns.googleapis.com",
];

const rolesDefault = [
  "iam.serviceAccountAdmin",
  "compute.admin",
  "storage.admin",
  "dns.admin",
  "editor",
  "resourcemanager.projectIamAdmin",
];

const fnSpecs = (config) => [
  ...GcpStorage(config),
  ...GcpIam(config),
  ...GcpCompute(config),
  ...GcpDns(config),
];
const ProjectId = ({ projectName }) => `grucloud-${projectName}`;

const ApplicationCredentialsFile = ({
  configDir = path.resolve(os.homedir(), ".config/gcloud"),
  projectId,
}) => path.resolve(configDir, `${projectId}.json`);

const authorize = async ({ applicationCredentialsFile }) => {
  logger.debug(`authorize with file: ${applicationCredentialsFile}`);

  assert(applicationCredentialsFile);
  if (
    !(await fs
      .access(applicationCredentialsFile)
      .then(() => true)
      .catch(() => false))
  ) {
    const message = `Cannot open application credentials file ${applicationCredentialsFile}\nPease run the command 'gc init' to initialise the provider`;
    throw { code: 422, message };
  }
  const keys = require(applicationCredentialsFile);
  logger.debug(`authorize with email: ${keys.client_email}`);

  const client = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  const accessToken = await new Promise((resolve, reject) => {
    client.authorize((err, response) => {
      if (err) {
        logger.error(`authorize error with ${keys.client_email}`);
        logger.error(tos(err));
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

const runGCloudCommand = tryCatch(
  ({ command }) => {
    const { stdout, stderr, code } = shell.exec(command, { silent: true });
    if (code !== 0) {
      throw { message: `command '${command}' failed`, stdout, stderr, code };
    }
    const config = JSON.parse(stdout);
    logger.debug(`runGCloudCommand: '${command}' result: ${tos(config)}`);
    return config;
  },
  (error) => {
    logger.error(`runGCloudCommand: ${tos(error)}`);
    //throw error;
    return { error };
  }
);

const getConfig = () =>
  runGCloudCommand({ command: "gcloud info --format json" });

const getDefaultAccessToken = () => {
  const result = runGCloudCommand({
    command: "gcloud auth print-access-token --format json",
  });
  if (result.error) {
    const result = runGCloudCommand({
      command: "gcloud auth login",
    });
    if (!result.error) {
      return getDefaultAccessToken();
    }
  } else {
    assert(result.token_response);
    assert(result.token_response.access_token);
    return result.token_response.access_token;
  }
};

exports.authorize = authorize;

const serviceEnable = async ({ accessToken, projectId }) => {
  const axios = AxiosMaker({
    baseURL: `https://serviceusage.googleapis.com/v1/projects/${projectId}`,
    onHeaders: () => ({
      Authorization: `Bearer ${accessToken}`,
    }),
  });
  return pipe([
    tap(() => {
      console.log(
        `Enabling ${servicesApis.length} services: ${servicesApis.join(", ")}`
      );
    }),
    () => axios.get("/services?filter=state:ENABLED"),
    tap((xxx) => {
      logger.debug("services");
    }),
    get("data.services"),
    tap((xxx) => {
      logger.debug("services");
    }),
    pluck("config.name"),
    (servicesEnabled = []) =>
      filter((service) => !servicesEnabled.includes(service))(servicesApis),
    switchCase([
      (serviceIds) => !isEmpty(serviceIds),
      pipe([
        tap((serviceIds) => {
          logger.info(`Enabling ${serviceIds.length} services`);
        }),
        (serviceIds) => axios.post("/services:batchEnable", { serviceIds }),
      ]),
      tap(() => {
        console.log("Services already enabled");
      }),
    ]),
  ])();
};

const ServiceAccountEmail = ({ serviceAccountName, projectId }) =>
  `${serviceAccountName}@${projectId}.iam.gserviceaccount.com`;

const serviceAccountCreate = async ({
  accessToken,
  projectId,
  serviceAccountName,
}) => {
  const axios = AxiosMaker({
    baseURL: `https://iam.googleapis.com/v1/projects/${projectId}/serviceAccounts`,
    onHeaders: () => ({
      Authorization: `Bearer ${accessToken}`,
    }),
  });

  const serviceAccountEmail = ServiceAccountEmail({
    serviceAccountName,
    projectId,
  });
  console.log(`Creating service account ${serviceAccountEmail}`);

  return pipe([
    tap((xx) => {
      logger.debug("getting service accounts");
    }),
    () => axios.get("/"),
    get("data.accounts"),
    find((account) => account.email === serviceAccountEmail),
    tap((xx) => {
      logger.debug("serviceAccountCreate");
    }),
    switchCase([
      (account) => !account,
      pipe([
        () => {
          logger.debug(`creating service account ${serviceAccountName}`);
        },
        () =>
          axios.post("/", {
            accountId: serviceAccountName,
            serviceAccount: {
              displayName: `${serviceAccountName} service account`,
            },
          }),
        () => {
          logger.debug(`service account ${serviceAccountName} created`);
        },
      ]),
      tap((account) => {
        logger.debug("service account already created");
      }),
    ]),
  ])();
};

const serviceAccountKeyCreate = async ({
  accessToken,
  projectId,
  serviceAccountName,
  applicationCredentialsFile,
}) => {
  const serviceAccountEmail = ServiceAccountEmail({
    serviceAccountName,
    projectId,
  });

  const axios = AxiosMaker({
    baseURL: `https://iam.googleapis.com/v1/projects/${projectId}/serviceAccounts/${serviceAccountEmail}/keys`,
    onHeaders: () => ({
      Authorization: `Bearer ${accessToken}`,
    }),
  });

  return pipe([
    switchCase([
      () =>
        fs
          .access(applicationCredentialsFile)
          .then(() => false)
          .catch(() => true),
      pipe([
        tap((xx) => {
          logger.debug(
            `creating service account keys for ${serviceAccountEmail}`
          );
        }),
        () => axios.post("/", {}),
        get("data"),
        tap((xx) => {
          logger.debug("service account keys created");
        }),
        ({ privateKeyData }) =>
          Buffer.from(privateKeyData, "base64").toString("utf-8"),
        (credentials) => fs.writeFile(applicationCredentialsFile, credentials),
        tap((xx) => {
          logger.debug(
            `service account keys saved in ${applicationCredentialsFile}`
          );
        }),
      ]),
      tap(() => {
        console.log("Service account key already created");
      }),
    ]),
  ])();
};

const addRolesToBindings = ({ currentBindings, rolesToAdd, member }) =>
  pipe([
    () => map((role) => `roles/${role}`)(rolesToAdd),
    (rolesToAddPrefixed) =>
      pipe([
        tap(() => {
          console.log(
            `Bind ${rolesToAdd.length} roles: ${rolesToAdd.join(
              ", "
            )} to member: ${member}`
          );
        }),
        map(({ role, members }) => {
          if (rolesToAddPrefixed.includes(role)) {
            return { role, members: uniq([...members, member]) };
          } else {
            return { role, members };
          }
        }),
        (bindings) =>
          pipe([
            () =>
              filter(
                (role) => !find((binding) => binding.role === role)(bindings)
              )(rolesToAddPrefixed),
            map((role) => ({ role, members: [member] })),
            (newBindings) => [...bindings, ...newBindings],
          ])(),
        tap((xx) => {
          logger.debug("addRolesToBindings");
        }),
      ])(currentBindings),
  ])();

const addIamPolicy = async ({ accessToken, projectId, serviceAccountName }) => {
  const axios = AxiosMaker({
    baseURL: `https://cloudresourcemanager.googleapis.com/v1/projects/${projectId}`,
    onHeaders: () => ({
      Authorization: `Bearer ${accessToken}`,
    }),
  });

  const member = `serviceAccount:${ServiceAccountEmail({
    serviceAccountName,
    projectId,
  })}`;

  return pipe([
    tap(() => {
      logger.debug("getting iam policy");
    }),
    () => axios.post(":getIamPolicy"),
    get("data"),
    (currentPolicy) =>
      pipe([
        () => ({
          etag: currentPolicy.etag,
          bindings: addRolesToBindings({
            currentBindings: currentPolicy.bindings,
            rolesToAdd: rolesDefault,
            member,
          }),
        }),
        switchCase([
          (newPolicy) =>
            !isDeepEqual(currentPolicy.bindings, newPolicy.bindings),
          pipe([
            tap((newPolicy) => {
              logger.debug(`updating iam policy`);
              logger.debug(tos(currentPolicy));
              logger.debug(`new policy:`);
              logger.debug(tos(newPolicy));
            }),
            (policy) => axios.post(":setIamPolicy", { policy }),
            tap((xx) => {
              logger.debug("iam policy updated");
            }),
          ]),
          tap(() => {
            console.log(`Iam policy already up to date`);
          }),
        ]),
      ])(),
  ])();
};
const createProject = async ({ accessToken, projectName, projectId }) => {
  console.log(`Creating project ${projectName}, projectId: ${projectId}`);

  assert(projectName);
  const axiosProject = AxiosMaker({
    baseURL: `https://cloudresourcemanager.googleapis.com/v1/projects`,
    onHeaders: () => ({
      Authorization: `Bearer ${accessToken}`,
    }),
  });

  return pipe([
    () => axiosProject.get("/"),
    get("data.projects"), //
    tap((xxx) => {
      logger.debug(`createProject`);
    }),
    filter(({ lifecycleState }) => lifecycleState === "ACTIVE"),
    find((project) => project.projectId === projectId),
    switchCase([
      (project) => project,
      tap((project) => {
        console.log(`project ${projectName} already exist`);
      }),
      pipe([
        tap(() => {
          logger.debug(`creating project ${projectName}`);
        }),
        () =>
          axiosProject.post("/", {
            name: projectName,
            projectId,
          }),
        tap(() => {
          logger.debug(`project ${projectName} created`);
        }),
      ]),
    ]),
  ])();
};

const setupBilling = async ({ accessToken, projectId }) => {
  const axiosBilling = AxiosMaker({
    baseURL: `https://cloudbilling.googleapis.com/v1`,
    onHeaders: () => ({
      Authorization: `Bearer ${accessToken}`,
    }),
  });
  console.log(`Setup billing`);

  return pipe([
    tap(() => {
      logger.debug(`setupBilling billingAccounts for project ${projectId}`);
    }),
    () => axiosBilling.get(`/projects/${projectId}/billingInfo`),
    get("data"),
    tap((billingInfo) => {
      logger.debug(`setupBilling billingInfo for project: ${billingInfo}`);
    }),
    switchCase([
      get("billingEnabled"),
      tap((billingInfo) => {
        console.log(
          `billing '${billingInfo.billingAccountName}' already enabled`
        );
        logger.debug(`billing already enabled`);
      }),
      pipe([
        () => axiosBilling.get(`/billingAccounts`),
        get("data.billingAccounts"),
        tap((billingAccounts) => {
          logger.debug(`setupBilling billingAccounts: ${tos(billingAccounts)}`);
        }),
        filter(({ open }) => open),
        switchCase([
          isEmpty,
          () => {
            throw "no active billing account";
          },
          pipe([
            first,
            tap((billingAccount) => {
              logger.debug(`enabling billing account ${tos(billingAccount)}`);
            }),
            tap((billingAccount) =>
              axiosBilling.put(`/projects/${projectId}/billingInfo`, {
                billingAccountName: billingAccount.name,
                billingEnabled: true,
              })
            ),
            tap(() => {
              logger.debug(`billing account enabled`);
            }),
          ]),
        ]),
      ]),
    ]),
  ])();
};
const init = async ({
  gcloudConfig,
  projectId,
  projectName,
  applicationCredentialsFile,
}) => {
  if (!gcloudConfig.config) {
    console.error(`gcloud is not installed, setup aborted`);
    return;
  }
  console.log(`Initializing project ${projectId}`);
  const accessToken = getDefaultAccessToken();
  if (!accessToken) {
    logger.debug(
      `cannot get default access token, run 'gcloud auth login' and try again`
    );
    return;
  }

  const serviceAccountName = "grucloud";

  await createProject({ projectName, projectId, accessToken });

  await setupBilling({ projectId, accessToken });

  await serviceEnable({ projectId, accessToken });

  await serviceAccountCreate({
    projectId,
    accessToken,
    serviceAccountName,
  });
  console.log(
    `Create and save credential file to ${applicationCredentialsFile}`
  );

  await serviceAccountKeyCreate({
    projectId,
    projectName,
    accessToken,
    serviceAccountName,
    applicationCredentialsFile,
  });
  console.log(`Update iam policy`);

  await addIamPolicy({
    accessToken,
    projectId,
    serviceAccountName,
  });
  console.log(`Project is now initialized`);
};

exports.GoogleProvider = ({ name = "google", config: configUser }) => {
  const { projectName } = configUser;
  assert(projectName, "missing projectName");

  const gcloudConfig = getConfig();

  const config = pipe([
    defaultsDeep({
      managedByTag: "-managed-by-gru",
      managedByKey: "managed-by",
      managedByValue: "grucloud",
      projectId: ProjectId({ projectName }),
    }),
    (config) => {
      if (gcloudConfig.config) {
        return pipe([
          defaultsDeep(
            pick(["region", "zone"])(gcloudConfig.config.properties.compute) ||
              {}
          ),
          defaultsDeep(computeDefault),
        ])(config);
      } else {
        return config;
      }
    },
  ])(configUser);

  const { projectId } = config;
  const applicationCredentialsFile = ApplicationCredentialsFile({
    configDir: gcloudConfig.config?.paths.global_config_dir,
    projectId,
  });

  let serviceAccountAccessToken;

  const start = async () => {
    serviceAccountAccessToken = await authorize({
      applicationCredentialsFile,
    });
  };
  const core = CoreProvider({
    type: "google",
    name,
    config: defaultsDeep({
      project: config.projectId,
      accessToken: () => serviceAccountAccessToken,
    })(config),
    fnSpecs,
    start,
    init: () =>
      init({
        gcloudConfig,
        projectName,
        projectId,
        applicationCredentialsFile,
      }),
  });

  return core;
};
