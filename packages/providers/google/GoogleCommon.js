const assert = require("assert");
const { pipe, tap, get, assign, omit } = require("rubico");
const { identity } = require("rubico/x");
const urljoin = require("url-join");
const { omitIfEmpty, compare } = require("@grucloud/core/Common");
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

exports.compare = ({
  filterAll = identity,
  filterTarget = identity,
  filterLive = identity,
} = {}) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    compare({
      filterAll,
      filterTarget,
      filterTargetDefault: pipe([
        omit(["kind", "metadata.name"]),
        omitIfEmpty(["metadata"]),
      ]),
      filterLive,
      filterLiveDefault: pipe([
        omit([
          "kind",
          "selfLink",
          "id",
          "metageneration",
          "etag",
          "timeCreated",
          "iamConfiguration",
          "projectNumber",
          "locationType",
          "iam",
          "updated",
          "metadata",
        ]),
      ]),
    }),
    tap((params) => {
      assert(true);
    }),
  ]);
