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
