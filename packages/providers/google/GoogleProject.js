const assert = require("assert");

const { pipe, get, tap, filter, switchCase, eq } = require("rubico");
const { isEmpty, find } = require("rubico/x");

const AxiosMaker = require("@grucloud/core/AxiosMaker");

const logger = require("@grucloud/core/logger")({ prefix: "GoogleProject" });

exports.createProject = async ({ accessToken, projectName, projectId }) => {
  console.log(`Creating project ${projectName}, projectId: ${projectId}`);

  assert(projectName);
  const axiosProject = AxiosMaker({
    baseURL: `https://cloudresourcemanager.googleapis.com/v1/projects`,
    onHeaders: () => ({
      Authorization: `Bearer ${accessToken}`,
    }),
  });

  return pipe([
    () => axiosProject.get("/"),
    get("data.projects"),
    tap((projects) => {
      logger.debug(`Current projects: ${JSON.stringify(projects)}`);
    }),
    filter(eq(get("lifecycleState"), "ACTIVE")),
    find(eq(get("projectId"), projectId)),
    switchCase([
      isEmpty,
      pipe([
        tap(() => {
          logger.debug(
            `Creating project ${projectName}, projectId: ${projectId}`
          );
        }),
        () =>
          axiosProject.post("/", {
            name: projectName,
            projectId,
          }),
        tap(() => {
          logger.debug(`project ${projectName} created`);
        }),
      ]),
      tap((project) => {
        console.log(`project ${projectId} already exist`);
      }),
    ]),
  ])();
};
