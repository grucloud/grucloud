const assert = require("assert");
const {
  pipe,
  get,
  filter,
  tap,
  assign,
  eq,
  map,
  tryCatch,
  fork,
} = require("rubico");
const {
  findIndex,
  append,
  when,
  isEmpty,
  identity,
  includes,
  callProp,
} = require("rubico/x");
const prompts = require("prompts");

const { execCommandShell } = require("./createProjectCommon");

const gcloudExecCommand =
  ({} = {}) =>
  (command) =>
    pipe([
      () => `gcloud ${command}`,
      execCommandShell({ transform: append(" --format=json") }),
      tap((params) => {
        assert(true);
      }),
    ])();

const isGcloudPresent = pipe([
  () => "version",
  tryCatch(
    pipe([
      gcloudExecCommand(),
      tap((params) => {
        assert(true);
      }),
    ]),
    (error) => {
      console.error(
        "The gcloud CLI is not installed.\nVisit https://cloud.google.com/sdk/docs/install to install gcloud\n"
      );
      process.exit(-1);
    }
  ),
]);

const authLogin = pipe([
  () => "auth login",
  tryCatch(
    pipe([
      gcloudExecCommand(),
      tap((account) => {
        assert(true);
      }),
    ]),
    (error) =>
      pipe([
        tap((params) => {
          assert(error);
        }),
        () => {
          console.error("not authenticated");
        },
      ])()
  ),
]);

const isAuthenticated = pipe([
  () => "auth list",
  tryCatch(
    pipe([
      gcloudExecCommand(),
      tap((account) => {
        assert(true);
      }),
      when(isEmpty, pipe([authLogin, () => isAuthenticated()])),
    ]),
    (error) =>
      pipe([
        () => {
          throw error;
        },
      ])()
  ),
]);

const initialProjectIndex = ({ projectCurrent, choices }) =>
  pipe([
    () => choices,
    findIndex(eq(get("value"), projectCurrent)),
    when(eq(identity, -1), () => 0),
  ])();

const promptGoogleProjectId = pipe([
  () => `config get-value project`,
  gcloudExecCommand(),
  (projectCurrent) =>
    pipe([
      () => `projects list`,
      gcloudExecCommand(),
      filter(eq(get("lifecycleState"), "ACTIVE")),
      map(({ name, projectId }) => ({
        title: projectId,
        description: name,
        value: projectId,
      })),
      (choices) => ({
        type: "autocomplete",
        limit: 40,
        name: "projectId",
        message: "Select the project Id",
        choices,
        initial: initialProjectIndex({ projectCurrent, choices }),
      }),
      prompts,
      get("projectId"),
    ])(),
]);

const initialRegionIndex = ({ regionCurrent, regions }) =>
  pipe([
    () => regions,
    findIndex(eq(get("name"), regionCurrent)),
    when(eq(identity, -1), () => 0),
  ])();

const promptRegion = pipe([
  fork({
    regionCurrent: pipe([
      () => `config get-value compute/region`,
      gcloudExecCommand(),
      when(isEmpty, () => undefined),
    ]),
    regions: pipe([() => `compute regions list`, gcloudExecCommand()]),
  }),
  tap((params) => {
    assert(true);
  }),
  ({ regionCurrent, regions }) =>
    pipe([
      () => regions,
      map(({ name, description }) => ({
        title: name,
        description: description,
        value: name,
      })),
      (choices) => ({
        type: "autocomplete",
        limit: 40,
        name: "region",
        message: "Select the region",
        choices,
        initial: initialRegionIndex({ regionCurrent, regions }),
      }),
      prompts,
      get("region"),
    ])(),
]);

const initialZoneIndex = ({ zoneCurrent, zones }) =>
  pipe([
    tap(() => {
      //assert(zoneCurrent);
      assert(zones);
    }),
    () => zones,
    findIndex(eq(get("name"), zoneCurrent)),
    when(eq(identity, -1), () => 0),
  ])();

const promptZone = pipe([
  assign({
    zoneCurrent: pipe([
      () => `config get-value compute/zone`,
      gcloudExecCommand(),
      when(isEmpty, () => undefined),
    ]),
  }),
  assign({
    zones: ({ region }) =>
      pipe([
        () => `compute zones list`,
        gcloudExecCommand(),
        filter(pipe([get("region"), includes(region)])),
        callProp("sort", (a, b) => a.name.localeCompare(b.name)),
      ])(),
  }),
  ({ zoneCurrent, zones }) =>
    pipe([
      () => zones,
      map(({ name, description }) => ({
        title: name,
        description: description,
        value: name,
      })),
      (choices) => ({
        type: "autocomplete",
        limit: 40,
        name: "zone",
        message: "Select the zone",
        choices,
        initial: initialZoneIndex({ zoneCurrent, zones }),
      }),
      prompts,
      get("zone"),
    ])(),
]);

const createConfig = ({ projectId, projectName }) =>
  pipe([
    tap(() => {
      assert(projectId);
    }),
    () => `module.exports = () => ({\n`,
    append(`  projectId: "${projectId}",\n`),
    append(`  projectName: "${projectName}",\n`),
    append("});"),
    tap((params) => {
      assert(true);
    }),
  ])();

exports.createProjectGoogle = pipe([
  tap((params) => {
    assert(true);
  }),
  tap(isGcloudPresent),
  tap(isAuthenticated),
  assign({ projectId: promptGoogleProjectId }),
  tap(
    pipe([
      tap(({ projectId }) => {
        assert(projectId);
      }),
      ({ projectId }) => `config set project ${projectId}`,
      gcloudExecCommand(),
    ])
  ),
  assign({ region: promptRegion }),
  tap(
    pipe([
      tap(({ region }) => {
        assert(region);
      }),
      ({ region }) => `config set compute/region ${region}`,
      gcloudExecCommand(),
    ])
  ),
  assign({ zone: promptZone }),
  tap(
    pipe([
      tap(({ zone }) => {
        assert(zone);
      }),
      ({ zone }) => `config set compute/zone ${zone}`,
      gcloudExecCommand(),
    ])
  ),
  tap((params) => {
    assert(true);
  }),
  assign({ config: createConfig }),
]);
