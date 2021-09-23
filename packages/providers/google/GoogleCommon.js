const assert = require("assert");
const { pipe, tap, get, assign, omit } = require("rubico");
const { identity } = require("rubico/x");
const urljoin = require("url-join");
const { detailedDiff } = require("deep-object-diff");
const { omitIfEmpty } = require("@grucloud/core/Common");
const logger = require("@grucloud/core/logger")({ prefix: "GoogleCommon" });
const { tos } = require("@grucloud/core/tos");
const AxiosMaker = require("@grucloud/core/AxiosMaker");

exports.buildLabel = ({
  managedByKey,
  stageTagKey,
  managedByValue,
  stage,
}) => ({
  [managedByKey]: managedByValue,
  [stageTagKey]: stage,
});

exports.shouldRetryOnException = ({ error, name }) => {
  logger.error(`gcp shouldRetryOnException ${tos({ name, error })}`);
  const { response } = error;
  if (!response) return false;
  if (
    response.status === 400 &&
    response.data?.error?.errors?.find(
      (error) => error.reason === "resourceNotReady"
    )
  ) {
    logger.info("shouldRetryOnException retrying");
    return true;
  }
  logger.info("shouldRetryOnException NOT retrying");

  return false;
};

exports.createAxiosMakerGoogle = ({
  baseURL = "",
  url = "",
  config,
  contentType,
}) =>
  AxiosMaker({
    baseURL: urljoin(baseURL, url),
    contentType,
    onHeaders: () => {
      const accessToken = config.accessToken();
      assert(accessToken, "accessToken not set");
      return {
        Authorization: `Bearer ${accessToken}`,
      };
    },
  });

const filterTargetDefault = identity;
const filterLiveDefault = identity;

exports.compare = ({
  filterAll = identity,
  filterTarget = filterTargetDefault,
  filterLive = filterLiveDefault,
} = {}) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    assign({
      target: pipe([
        get("target", {}),
        //removeOurTagObject,
        filterTarget,
        filterAll,
      ]),
      live: pipe([
        get("live"), // removeOurTagObject,
        filterLive,
        filterAll,
      ]),
    }),
    tap((params) => {
      assert(true);
    }),
    ({ target, live }) => ({
      targetDiff: pipe([
        () => detailedDiff(target, live),
        omit(["added"]),
        omitIfEmpty(["deleted", "updated" /*, "added"*/]),
        tap((params) => {
          assert(true);
        }),
      ])(),
      liveDiff: pipe([
        () => detailedDiff(live, target),
        omit(["deleted"]),
        omitIfEmpty(["added", "updated" /*, "deleted"*/]),
        tap((params) => {
          assert(true);
        }),
      ])(),
    }),
    tap((diff) => {
      assert(true);
    }),
  ]);
