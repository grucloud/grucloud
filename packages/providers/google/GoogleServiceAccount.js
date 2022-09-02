const assert = require("assert");
const fs = require("fs").promises;

const { pipe, get, tap, switchCase } = require("rubico");
const { find } = require("rubico/x");
const logger = require("@grucloud/core/logger")({
  prefix: "GoogleServiceAccount",
});

const AxiosMaker = require("@grucloud/core/AxiosMaker");
const { ServiceAccountEmail } = require("./GoogleCommon");

const createAxiosServiceAccount = ({ accessToken, projectId }) =>
  AxiosMaker({
    baseURL: `https://iam.googleapis.com/v1/projects/${projectId}/serviceAccounts`,
    onHeaders: () => ({
      Authorization: `Bearer ${accessToken}`,
    }),
  });

exports.serviceAccountCreate = async ({
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

exports.serviceAccountDelete = async ({
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

exports.serviceAccountKeyCreate = async ({
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

exports.serviceAccountKeyDelete = async ({
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
