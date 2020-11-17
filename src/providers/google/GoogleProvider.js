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
const shell = require("shelljs");

const CoreProvider = require("../CoreProvider");
const AxiosMaker = require("../AxiosMaker");

const logger = require("../../logger")({ prefix: "GoogleProvider" });
const { tos } = require("../../tos");

const GcpCompute = require("./resources/compute/");
const GcpIam = require("./resources/iam/");
const GcpStorage = require("./resources/storage/");
const GcpDns = require("./resources/dns/");
const { retryCallOnError } = require("../Retry");

const computeDefault = {
  region: "europe-west4",
  zone: "europe-west4-a",
};

const servicesApiMapBase = {
  "cloudbilling.googleapis.com": {
    url: ({ projectId }) =>
      `https://cloudbilling.googleapis.com/v1/projects/${projectId}/billingInfo`,
  },
  "cloudresourcemanager.googleapis.com": {
    url: ({ projectId }) =>
      `https://cloudresourcemanager.googleapis.com/v1/projects/${projectId}/:getIamPolicy`,
    method: "POST",
  },
  "iam.googleapis.com": {
    url: ({ projectId }) =>
      `https://iam.googleapis.com/v1/projects/${projectId}/serviceAccounts`,
  },
  "serviceusage.googleapis.com": {
    url: ({ projectId }) =>
      `https://storage.googleapis.com/storage/v1/b?project=${projectId}`,
  },
};
const servicesApiMapMain = {
  "compute.googleapis.com": {
    url: ({ projectId, zone }) =>
      `https://compute.googleapis.com/compute/v1/projects/${projectId}/global/images`,
  },
  "dns.googleapis.com": {
    url: ({ projectId }) =>
      `https://dns.googleapis.com/dns/v1beta2/projects/${projectId}/managedZones`,
  },
  /*"domains.googleapis.com": {
    url: ({ projectId }) =>
      `https://domains.googleapis.com/v1beta1/projects/${projectId}/locations/global/registrations`,
  },*/
};
const rolesDefault = [
  "iam.serviceAccountAdmin",
  "compute.admin",
  "storage.admin",
  "storage.objectAdmin",
  "dns.admin",
  //"domains.admin",
  "editor",
  "resourcemanager.projectIamAdmin",
];
const ServiceAccountName = "grucloud";

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

const authorize = async ({
  gcloudConfig,
  projectName,
  projectId,
  applicationCredentialsFile,
}) => {
  logger.info(`authorize with file: ${applicationCredentialsFile}`);

  assert(applicationCredentialsFile);
  if (
    !(await fs
      .access(applicationCredentialsFile)
      .then(() => true)
      .catch(() => false))
  ) {
    const message = `Cannot open application credentials file ${applicationCredentialsFile}\nRunning 'gc init'`;
    console.log(message);
    await init({
      gcloudConfig,
      projectName,
      projectId,
      applicationCredentialsFile,
      serviceAccountName: ServiceAccountName,
    });
  }
  const keys = require(applicationCredentialsFile);
  logger.info(`authorize with email: ${keys.client_email}`);
  assert(keys.private_key, "keys.private_key");
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
    assert(result.token, `no token in ${tos(result)}`);
    return result.token;
  }
};

exports.authorize = authorize;

const createAxiosGeneric = ({ accessToken }) =>
  AxiosMaker({
    onHeaders: () => ({
      Authorization: `Bearer ${accessToken}`,
    }),
  });

const createAxiosService = ({ accessToken, projectId }) =>
  AxiosMaker({
    baseURL: `https://serviceusage.googleapis.com/v1/projects/${projectId}`,
    onHeaders: () => ({
      Authorization: `Bearer ${accessToken}`,
    }),
  });

const serviceEnable = async ({ accessToken, projectId, servicesApiMap }) => {
  const axiosService = createAxiosService({ accessToken, projectId });
  const axios = createAxiosGeneric({ accessToken, projectId });
  const servicesApis = Object.keys(servicesApiMap);
  return pipe([
    tap(() => {
      console.log(
        `Enabling ${servicesApis.length} services: ${servicesApis.join(", ")}`
      );
    }),
    () => axiosService.get("/services?filter=state:ENABLED"),
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
        tap((serviceIds) =>
          axiosService.post("/services:batchEnable", { serviceIds })
        ),
        tap(() => {
          console.log(
            `Waiting for services to take off, may take up to 10 minutes`
          );
        }),
        map((serviceId) =>
          pipe([
            () => servicesApiMap[serviceId].url({ projectId }),
            (url) =>
              retryCallOnError({
                name: `check for serviceId ${serviceId}, getting ${url}`,
                fn: () =>
                  axios.request({
                    url,
                    method: servicesApiMap[serviceId].method || "GET",
                  }),
                config: { retryCount: 120, retryDelay: 10e3 },
                shouldRetryOnException: (error) => {
                  return [403].includes(error.response?.status);
                },
              }),
            tap(() => {
              console.log(`Service ${serviceId} is up`);
            }),
          ])()
        ),
        tap(() => {
          logger.info(`services up and running`);
        }),
      ]),
      tap(() => {
        console.log("Services already enabled");
      }),
    ]),
  ])();
};

const serviceDisable = async ({ accessToken, projectId, servicesApiMap }) => {
  const axios = createAxiosService({ accessToken, projectId });
  const servicesApis = Object.keys(servicesApiMap);

  return pipe([
    tap(() => {
      console.log(
        `Disabling ${servicesApis.length} services: ${servicesApis.join(", ")}`
      );
    }),
    () => axios.get("/services?filter=state:ENABLED"),
    get("data.services"),
    tap((xxx) => {
      logger.debug("services");
    }),
    pluck("config.name"),
    (servicesEnabled = []) =>
      filter((service) => servicesEnabled.includes(service))(servicesApis),
    switchCase([
      (serviceIds) => !isEmpty(serviceIds),
      pipe([
        tap((serviceIds) => {
          logger.info(`Disabled ${serviceIds.length} services`);
        }),
        map((serviceId) =>
          axios.post(`/services/${serviceId}:disable`, {
            disableDependentServices: true,
          })
        ),
        tap((xxx) => {
          console.log("Services disabled");
        }),
      ]),
      tap(() => {
        console.log("Services already disabled");
      }),
    ]),
  ])();
};

const createAxiosServiceAccount = ({ accessToken, projectId }) =>
  AxiosMaker({
    baseURL: `https://iam.googleapis.com/v1/projects/${projectId}/serviceAccounts`,
    onHeaders: () => ({
      Authorization: `Bearer ${accessToken}`,
    }),
  });

const ServiceAccountEmail = ({ serviceAccountName, projectId }) =>
  `${serviceAccountName}@${projectId}.iam.gserviceaccount.com`;

const serviceAccountCreate = async ({
  accessToken,
  projectId,
  serviceAccountName,
}) => {
  const axios = createAxiosServiceAccount({ accessToken, projectId });
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
          logger.debug(`Service account ${serviceAccountEmail} created`);
        },
      ]),
      tap((account) => {
        logger.debug("service account already created");
      }),
    ]),
  ])();
};

const serviceAccountDelete = async ({
  accessToken,
  projectId,
  serviceAccountName,
}) => {
  const axios = createAxiosServiceAccount({ accessToken, projectId });
  const serviceAccountEmail = ServiceAccountEmail({
    serviceAccountName,
    projectId,
  });

  console.log(`Deleting service account ${serviceAccountEmail}`);

  return pipe([
    tap((xx) => {
      logger.debug("getting service accounts");
    }),
    () => axios.get("/"),
    get("data.accounts"),
    find((account) => account.email === serviceAccountEmail),
    tap((xx) => {
      logger.debug("serviceAccountDelete");
    }),
    switchCase([
      (account) => account,
      pipe([
        tap((account) => {
          logger.debug(`deleting service account ${serviceAccountName}`);
        }),
        (account) =>
          axios.delete(`/${account.uniqueId}`).catch((error) => {
            if (error.response?.status !== 404) {
              throw error;
            }
          }),
        () => {
          console.log(`Service account ${serviceAccountEmail} deleted`);
        },
      ]),
      tap(() => {
        console.log("service account already deleted");
      }),
    ]),
  ])();
};

const createAxiosServiceAccountKey = ({
  accessToken,
  projectId,
  serviceAccountEmail,
}) =>
  AxiosMaker({
    baseURL: `https://iam.googleapis.com/v1/projects/${projectId}/serviceAccounts/${serviceAccountEmail}/keys`,
    onHeaders: () => ({
      Authorization: `Bearer ${accessToken}`,
    }),
  });

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

  const axios = createAxiosServiceAccountKey({
    accessToken,
    projectId,
    serviceAccountEmail,
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

const serviceAccountKeyDelete = async ({
  accessToken,
  projectId,
  serviceAccountName,
  applicationCredentialsFile,
}) => {
  const serviceAccountEmail = ServiceAccountEmail({
    serviceAccountName,
    projectId,
  });

  const axios = createAxiosServiceAccountKey({
    accessToken,
    projectId,
    serviceAccountEmail,
  });

  return pipe([
    switchCase([
      () =>
        fs
          .access(applicationCredentialsFile)
          .then(() => true)
          .catch(() => false),
      pipe([
        tap((xx) => {
          logger.debug(
            `delete service account keys for ${serviceAccountEmail}`
          );
        }),
        () => fs.readFile(applicationCredentialsFile, "utf-8"),
        (content) => JSON.parse(content),
        tap((content) => {
          logger.debug(`serviceAccountKeyDelete`);
        }),
        ({ private_key_id }) =>
          axios.delete(`/${private_key_id}`).catch((error) => {
            logger.error(`error deleting key ${private_key_id}`);
          }),
        tap((xx) => {
          logger.debug("service account keys deleted");
        }),
        () => fs.unlink(applicationCredentialsFile),
        tap((xx) => {
          console.log(
            `service account keys file '${applicationCredentialsFile}' deleted`
          );
        }),
      ]),
      tap(() => {
        console.log("Service account key already deleted");
      }),
    ]),
  ])();
};

const bindingsAdd = ({ currentBindings, rolesToAdd, member }) =>
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
          logger.debug("bindingsAdd");
        }),
      ])(currentBindings),
  ])();

const bindingsRemove = ({ currentBindings, memberToRemove }) =>
  pipe([
    tap(() => {
      console.log(`Remove Bindings for member: ${memberToRemove}`);
    }),
    map(({ role, members }) => {
      return {
        role,
        members: pipe([
          filter((member) => member != memberToRemove),
          filter((member) => !member.startsWith("deleted:")),
        ])(members),
      };
    }),
    filter((binding) => !isEmpty(binding.members)),
    tap((xx) => {
      logger.debug("bindingsRemove");
    }),
  ])(currentBindings);

const createAxiosIam = ({ projectId, accessToken }) =>
  AxiosMaker({
    baseURL: `https://cloudresourcemanager.googleapis.com/v1/projects/${projectId}`,
    onHeaders: () => ({
      Authorization: `Bearer ${accessToken}`,
    }),
  });

const MemberServiceAccount = ({ serviceAccountName, projectId }) =>
  `serviceAccount:${ServiceAccountEmail({
    serviceAccountName,
    projectId,
  })}`;

const iamPolicyAdd = async ({ accessToken, projectId, serviceAccountName }) => {
  const axios = createAxiosIam({ projectId, accessToken });
  const member = MemberServiceAccount({ serviceAccountName, projectId });

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
          bindings: bindingsAdd({
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

const iamPolicyRemove = async ({
  accessToken,
  projectId,
  serviceAccountName,
}) => {
  const axios = createAxiosIam({ projectId, accessToken });
  const memberToRemove = MemberServiceAccount({
    serviceAccountName,
    projectId,
  });

  console.log(`Removing Iam binding for member ${memberToRemove} `);

  return pipe([
    tap(() => {
      logger.debug("getting iam policy");
    }),
    () => axios.post(":getIamPolicy"),
    get("data"),
    (currentPolicy) =>
      pipe([
        tap(() => {
          logger.debug("iamPolicyRemove ");
        }),
        () => ({
          etag: currentPolicy.etag,
          bindings: bindingsRemove({
            currentBindings: currentPolicy.bindings,
            memberToRemove,
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
    get("data.projects"),
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

const createAxiosBilling = ({ accessToken, projectId }) =>
  AxiosMaker({
    baseURL: `https://cloudbilling.googleapis.com/v1`,
    onHeaders: () => ({
      Authorization: `Bearer ${accessToken}`,
    }),
  });

const billingEnable = async ({ accessToken, projectId }) => {
  const axiosBilling = createAxiosBilling({ accessToken });
  console.log(`Setup billing`);

  return pipe([
    tap(() => {
      logger.debug(`billingEnable for project ${projectId}`);
    }),
    () => axiosBilling.get(`/projects/${projectId}/billingInfo`),
    get("data"),
    tap((billingInfo) => {
      logger.debug(`billingEnable billingInfo for project: ${billingInfo}`);
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
          logger.debug(
            `billingEnable billingAccounts: ${tos(billingAccounts)}`
          );
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
const billingDisable = async ({ accessToken, projectId }) => {
  const axiosBilling = createAxiosBilling({ accessToken });
  console.log(`Disable billing`);

  return pipe([
    tap(() => {
      logger.debug(`billingDisable for project ${projectId}`);
    }),
    () => axiosBilling.get(`/projects/${projectId}/billingInfo`),
    get("data"),
    tap((billingInfo) => {
      logger.debug(`billingDisable billingInfo: ${billingInfo}`);
    }),
    switchCase([
      get("billingEnabled"),
      pipe([
        tap((billingInfo) => {
          console.log(`billing '${billingInfo.billingAccountName}'`);
          logger.debug(`disable billing`);
        }),
        tap((billingInfo) =>
          axiosBilling.put(`/projects/${projectId}/billingInfo`, {
            billingAccountName: billingInfo.billingAccountName,
            billingEnabled: false,
          })
        ),
        tap((billingInfo) => {
          console.log(`billing '${billingInfo.billingAccountName}' disabled`);
        }),
      ]),
      tap(() => {
        logger.debug(`billing already disabled`);
      }),
    ]),
  ])();
};
const init = async ({
  gcloudConfig,
  projectId,
  projectName,
  applicationCredentialsFile,
  serviceAccountName,
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

  await createProject({ projectName, projectId, accessToken });

  await serviceEnable({
    projectId,
    accessToken,
    servicesApiMap: servicesApiMapBase,
  });

  await billingEnable({ projectId, accessToken });

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

  await iamPolicyAdd({
    accessToken,
    projectId,
    serviceAccountName,
  });

  await serviceEnable({
    projectId,
    accessToken,
    servicesApiMap: servicesApiMapMain,
  });

  console.log(`Project is now initialized`);
};

const unInit = async ({
  gcloudConfig,
  projectId,
  projectName,
  applicationCredentialsFile,
  serviceAccountName,
}) => {
  if (!gcloudConfig.config) {
    console.error(`gcloud is not installed, setup aborted`);
    return;
  }
  console.log(`De-initializing project ${projectId}`);
  const accessToken = getDefaultAccessToken();
  if (!accessToken) {
    logger.debug(
      `cannot get default access token, run 'gcloud auth login' and try again`
    );
    return;
  }

  await iamPolicyRemove({
    accessToken,
    projectId,
    serviceAccountName,
  });

  await serviceAccountKeyDelete({
    projectId,
    projectName,
    accessToken,
    serviceAccountName,
    applicationCredentialsFile,
  });

  await serviceAccountDelete({
    projectId,
    accessToken,
    serviceAccountName,
  });

  //await billingDisable({ projectId, accessToken });
  //await removeProject({ projectName, projectId, accessToken });
  await serviceDisable({
    projectId,
    accessToken,
    servicesApiMap: servicesApiMapMain,
  });
  await serviceDisable({
    projectId,
    accessToken,
    servicesApiMap: servicesApiMapBase,
  });

  console.log(`Project is now un-initialized`);
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
      gcloudConfig,
      projectId,
      projectName,
      applicationCredentialsFile,
    });
    logger.debug(`started`);
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
        serviceAccountName: ServiceAccountName,
      }),
    unInit: () =>
      unInit({
        gcloudConfig,
        projectName,
        projectId,
        applicationCredentialsFile,
        serviceAccountName: ServiceAccountName,
      }),
  });

  return core;
};
