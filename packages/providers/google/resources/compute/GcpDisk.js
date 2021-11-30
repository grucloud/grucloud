const assert = require("assert");
const { get, eq, pipe, tap, any, assign } = require("rubico");
const { defaultsDeep, find, when } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "GcpDisk" });
const { tos } = require("@grucloud/core/tos");
const GoogleClient = require("../../GoogleClient");
const { GCP_COMPUTE_BASE_URL } = require("./GcpComputeCommon");
const { isUpByIdCore } = require("@grucloud/core/Common");
const { buildLabel } = require("../../GoogleCommon");

// https://cloud.google.com/compute/docs/reference/rest/v1/disks
exports.GcpDisk = ({ spec, config }) => {
  assert(spec);
  assert(config);
  assert(config.stage);
  const { projectId, zone } = config;
  assert(zone);

  const configDefault = ({ name, properties }) =>
    pipe([
      () => properties,
      when(
        get("type"),
        assign({
          type: ({ type }) =>
            `projects/${projectId}/zones/${zone}/diskTypes/${type}`,
        })
      ),
      defaultsDeep({
        name,
        labels: buildLabel(config),
      }),
    ])();

  const isInstanceUp = eq(get("status"), "READY");

  const isUpByIdFactory = ({ getById }) =>
    isUpByIdCore({
      isInstanceUp,
      getById,
    });

  const managedByOther = ({ live, lives }) =>
    pipe([
      tap(() => {
        assert(lives);
        assert(live);
      }),
      () =>
        lives.getByType({
          type: "VmInstance",
          group: "compute",
          providerName: config.providerName,
        }),
      any(
        pipe([
          get("live.disks"),
          find(eq(get("source"), live.selfLink)),
          get("boot"),
        ])
      ),
    ])();

  return GoogleClient({
    spec,
    baseURL: GCP_COMPUTE_BASE_URL,
    url: `/projects/${projectId}/zones/${zone}/disks`,
    config,
    isInstanceUp,
    isUpByIdFactory,
    configDefault,
    managedByOther,
    cannotBeDeleted: managedByOther,
  });
};
