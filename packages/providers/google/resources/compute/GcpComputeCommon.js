exports.GCP_COMPUTE_BASE_URL = "https://www.googleapis.com/compute/v1";

const { eq, get, pipe, tap } = require("rubico");
const { find } = require("rubico/x");

exports.findDependenciesNetwork = ({ live, lives, providerName }) => ({
  type: "Network",
  ids: pipe([
    () => live,
    get("network"),
    (network) =>
      pipe([
        () =>
          lives.getByType({ type: "Network", group: "compute", providerName }),
        find(eq(get("live.selfLink"), network)),
        get("id"),
      ])(),
    (id) => [id],
  ])(),
});
