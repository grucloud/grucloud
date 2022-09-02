const assert = require("assert");

const { pipe, get, tap, filter, switchCase } = require("rubico");
const { isEmpty, first } = require("rubico/x");

const AxiosMaker = require("@grucloud/core/AxiosMaker");

const logger = require("@grucloud/core/logger")({ prefix: "GoogleProvider" });
const { tos } = require("@grucloud/core/tos");

const createAxiosBilling = ({ accessToken, projectId }) =>
  AxiosMaker({
    baseURL: `https://cloudbilling.googleapis.com/v1`,
    onHeaders: () => ({
      Authorization: `Bearer ${accessToken}`,
    }),
  });

exports.billingEnable = async ({ accessToken, projectId }) => {
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

exports.billingDisable = async ({ accessToken, projectId }) => {
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
