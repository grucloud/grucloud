const assert = require("assert");
const urljoin = require("url-join");
const { pipe, get, tap, eq } = require("rubico");
const { find, first, isEmpty } = require("rubico/x");
const fs = require("fs");
const https = require("https");
const logger = require("../../logger")({ prefix: "K8sCommon" });
const { tos } = require("../../tos");
const AxiosMaker = require("../AxiosMaker");

exports.shouldRetryOnException = ({ error, name }) => {
  //TODO
  logger.error(`k8s shouldRetryOnException ${tos({ name, error })}`);
  return false;
};

exports.getServerUrl = (kubeConfig) =>
  pipe([
    tap((kubeConfig) => {
      //logger.debug("getServerUrl");
    }),
    get("clusters"),
    find(eq(get("name"), kubeConfig["current-context"])),
    get("cluster.server"),
    tap.if(isEmpty, () => {
      throw Error(`missing clusters[0].server ${tos({ kubeConfig })}`);
    }),
    tap((server) => {
      logger.debug(`getServerUrl ${server}`);
    }),
  ])(kubeConfig);

exports.createAxiosMakerK8s = ({ config, contentType }) =>
  pipe([
    () => config.kubeConfig(),
    (kubeConfig) =>
      pipe([
        get("users"),
        find(eq(get("name"), kubeConfig["current-context"])),
        get("user"),
      ])(kubeConfig),
    tap((user) => {
      logger.debug(`createAxiosMakerK8s`);
    }),
    (user) => ({
      rejectUnauthorized: false,
      ...(user["client-certificate"] && {
        cert: fs.readFileSync(user["client-certificate"]),
      }),
      ...(user["client-key"] && { key: fs.readFileSync(user["client-key"]) }),
    }),
    tap(({ cert, key }) => {
      //logger.debug(`createAxiosMakerK8s agentParam ${tos({ cert, key })}`);
    }),
    (agentParam) => new https.Agent(agentParam),
    (httpsAgent) =>
      AxiosMaker({
        contentType,
        httpsAgent,
        onHeaders: () => {
          assert(config.accessToken, "config.accessToken function not set");
          const accessToken = config.accessToken();
          assert(accessToken, "accessToken not set");
          return {
            Authorization: `Bearer ${accessToken}`,
          };
        },
      }),
  ])();
