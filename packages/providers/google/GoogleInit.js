const assert = require("assert");
const path = require("path");

const { tryCatch, pipe, tap, switchCase, fork } = require("rubico");
const { isEmpty } = require("rubico/x");

const { convertError } = require("@grucloud/core/Common");
const YAML = require("@grucloud/core/cli/json2yaml");
const {
  createProjectGoogle,
} = require("@grucloud/core/cli/providers/createProjectGoogle");
const logger = require("@grucloud/core/logger")({ prefix: "GoogleInit" });

const {
  serviceAccountCreate,
  serviceAccountDelete,
  serviceAccountKeyCreate,
  serviceAccountKeyDelete,
} = require("./GoogleServiceAccount");
const { createProject } = require("./GoogleProject");
const { serviceEnable, serviceDisable } = require("./GoogleService");
const { billingEnable, billingDisable } = require("./GoogleBilling");
const { iamPolicyAdd, iamPolicyRemove } = require("./GoogleIamPolicy");

const { getDefaultAccessToken } = require("./GoogleCommon");

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
  //container.googleapis.com
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
  "run.googleapis.com": {
    url: ({ projectId, region }) =>
      `https://${region}-run.googleapis.com/apis/serving.knative.dev/v1/namespaces/${projectId}/services`,
  },
  /*"domains.googleapis.com": {
    url: ({ projectId }) =>
      `https://domains.googleapis.com/v1beta1/projects/${projectId}/locations/global/registrations`,
  },*/
};

exports.init = ({
  gcloudConfig,
  projectId,
  projectName,
  region,
  applicationCredentialsFile,
  serviceAccountName,
  options,
  programOptions,
}) =>
  switchCase([
    () => gcloudConfig.config,
    tryCatch(
      pipe([
        tap(() => {
          assert(region);
          assert(programOptions.workingDirectory);
        }),
        fork({
          dirs: () => ({
            destination: path.resolve(programOptions.workingDirectory),
          }),
        }),
        tap((params) => {
          assert(true);
        }),
        createProjectGoogle,
        () => {
          console.log(`Initializing project ${projectId}`);
        },
        () => getDefaultAccessToken(),
        switchCase([
          isEmpty,
          () => {
            console.error(
              `Cannot get default access token, run 'gcloud auth login' and try again`
            );
          },
          (accessToken) =>
            pipe([
              () => createProject({ projectName, projectId, accessToken }),
              () =>
                serviceEnable({
                  projectId,
                  region,
                  accessToken,
                  servicesApiMap: servicesApiMapBase,
                }),
              () => billingEnable({ projectId, accessToken }),
              () =>
                serviceAccountCreate({
                  projectId,
                  accessToken,
                  serviceAccountName,
                }),
              () => {
                console.log(
                  `Create and save credential file to ${applicationCredentialsFile}`
                );
              },
              () =>
                serviceAccountKeyCreate({
                  projectId,
                  projectName,
                  accessToken,
                  serviceAccountName,
                  applicationCredentialsFile,
                }),
              () => {
                console.log(`Update IAM policy`);
              },
              () =>
                iamPolicyAdd({
                  accessToken,
                  projectId,
                  serviceAccountName,
                }),
              () =>
                serviceEnable({
                  region,
                  projectId,
                  accessToken,
                  servicesApiMap: servicesApiMapMain,
                }),
              () => {
                console.log(`Project ${projectName} is now initialized`);
              },
            ])(),
        ]),
      ]),
      pipe([
        tap((error) => {
          assert(true);
        }),
        (error) => convertError({ error }),
        tap((error) => {
          console.error(YAML.stringify(error));
        }),
        (error) => {
          throw error;
        },
      ])
    ),
    () => {
      console.error(`gcloud is not installed, setup aborted`);
    },
  ])();

exports.unInit = async ({
  gcloudConfig,
  projectId,
  projectName,
  applicationCredentialsFile,
  serviceAccountName,
  options = {},
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

  if (options.serviceAccountDelete) {
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
  }
  //await billingDisable({ projectId, accessToken });
  //await removeProject({ projectName, projectId, accessToken });
  if (options.servicesDelete) {
    await serviceDisable({
      projectId,
      accessToken,
      servicesApiMap: servicesApiMapMain,
    });
  }
  console.log(`Project is now un-initialized`);
};
