const assert = require("assert");
const { pipe, tap, get, tryCatch, omit, switchCase } = require("rubico");
const urljoin = require("url-join");
const { omitIfEmpty, compare } = require("@grucloud/core/Common");
const AxiosMaker = require("@grucloud/core/AxiosMaker");
const logger = require("@grucloud/core/logger")({ prefix: "GoogleCommon" });
const shell = require("shelljs");

exports.buildLabel = ({
  managedByKey,
  stageTagKey,
  managedByValue,
  stage,
}) => ({
  [managedByKey]: managedByValue,
  [stageTagKey]: stage,
});

exports.createAxiosMakerGoogle = ({
  baseURL = "",
  url = "",
  config,
  contentType,
}) =>
  pipe([
    tap((params) => {
      assert(baseURL);
    }),
    () => urljoin(baseURL, url),
    (baseURL) =>
      AxiosMaker({
        baseURL,
        contentType,
        onHeaders: () => {
          const accessToken = config.accessToken();
          assert(accessToken, "accessToken not set");
          return {
            Authorization: `Bearer ${accessToken}`,
          };
        },
      }),
  ])();

exports.compareGoogle = ({ filterAll, filterTarget, filterLive } = {}) =>
  pipe([
    compare({
      filterAll,
      filterTarget,
      filterTargetDefault: pipe([
        omit(["kind", "name", "zone", "metadata.name", "metadata.kind"]),
        omitIfEmpty(["metadata"]),
      ]),
      filterLive,
      filterLiveDefault: pipe([
        omit([
          "kind",
          "selfLink",
          "id",
          "creationTimestamp",
          "selfLink",
          "status",
          "fingerprint",
          "lastStartTimestamp",
          "metageneration",
          "etag",
          "timeCreated",
          "iamConfiguration",
          "projectNumber",
          "locationType",
          "iam",
          "updated",
          "metadata.kind",
          "metadata.fingerprint",
          "metadata.name",
          "metadata.namespace",
          "metadata.selfLink",
          "metadata.uid",
          "metadata.resourceVersion",
          "metadata.generation",
          "metadata.creationTimestamp",
          "tags.fingerprint",
          "name",
        ]),
        omitIfEmpty(["tags", "metadata.labels", "metadata"]),
        tap((params) => {
          assert(true);
        }),
      ]),
    }),
    tap((params) => {
      assert(true);
    }),
  ]);

const runGCloudCommand = tryCatch(
  ({ command }) => {
    logger.debug(`runGCloudCommand: ${command}`);

    const { stdout, stderr, code } = shell.exec(command, { silent: true });
    if (code !== 0) {
      throw { message: `command '${command}' failed`, stdout, stderr, code };
    }
    const config = JSON.parse(stdout);
    logger.debug(
      `runGCloudCommand: '${command}' result: ${JSON.stringify(config)}`
    );
    return config;
  },
  (error) => {
    logger.info(`runGCloudCommand: ${JSON.stringify(error)}`);
    //throw error;
    return { error };
  }
);

exports.runGCloudCommand = runGCloudCommand;

const getDefaultAccessToken = pipe([
  () => ({
    command: "gcloud auth print-access-token --format json",
  }),
  runGCloudCommand,
  switchCase([
    get("error"),
    pipe([
      () => ({
        command: "gcloud auth login",
      }),
      runGCloudCommand,
      get("error"),
      switchCase([
        isEmpty,
        () => getDefaultAccessToken(),
        (error) => {
          throw error;
        },
      ]),
    ]),
    pipe([
      get("token"),
      tap((token) => {
        assert(token, `no token`);
      }),
    ]),
  ]),
]);

exports.getDefaultAccessToken = getDefaultAccessToken;

exports.ServiceAccountEmail = ({ serviceAccountName, projectId }) =>
  `${serviceAccountName}@${projectId}.iam.gserviceaccount.com`;
