const assert = require("assert");
const { pipe, tap, tryCatch, map, assign, get, switchCase } = require("rubico");
const { callProp, when, includes, defaultsDeep, pluck } = require("rubico/x");
const prompts = require("prompts");
const { EOL } = require("os");
const {
  awsExecCommand,
} = require("@grucloud/core/cli/providers/createProjectAws");

const getCurrentRegion = pipe([
  tryCatch(
    pipe([
      tap(({ profile }) => {
        assert(profile);
      }),
      ({ profile }) => `configure get region --profile ${profile}`,
      awsExecCommand(),
      callProp("replace", EOL, ""),
      when(includes("undefined"), () => undefined),
    ]),
    () => undefined
  ),
]);

const promptOnCancel = (prompt) => {
  console.log("Canceled, quit now");
  process.exit(-2);
};

const confirmMoreRegion = pipe([
  tap(({ currentRegion }) => {
    assert(currentRegion);
  }),
  ({ currentRegion }) => ({
    type: "confirm",
    name: "moreRegions",
    message: `Current region is ${currentRegion}, Choose other or additional regions ?`,
    initial: false,
  }),
  (question) => prompts(question, { onCancel: promptOnCancel }),
  get("moreRegions"),
]);

const describeRegions = pipe([
  tap(({ profile }) => {
    assert(profile);
  }),
  ({ profile }) =>
    `ec2 describe-regions --region us-east-1 --profile ${profile}`,
  awsExecCommand(),
  get("Regions"),
  pluck("RegionName"),
  callProp("sort", (a, b) => a.localeCompare(b)),
]);

const selectRegions = ({ regionsAvailable, currentRegion }) =>
  pipe([
    tap((params) => {
      assert(regionsAvailable);
    }),
    () => regionsAvailable,
    map((RegionName) => ({
      title: RegionName,
      description: RegionName,
      value: RegionName,
      selected: RegionName === currentRegion ? true : false,
    })),
    (choices) => ({
      type: "autocompleteMultiselect",
      name: "regions",
      message: "Select regions",
      choices,
      optionsPerPage: 60,
      hint: "- Space to select. Return to submit",
    }),
    (question) => prompts(question, { onCancel: promptOnCancel }),
    tap((params) => {
      assert(true);
    }),
    get("regions"),
  ])();

exports.promptRegion = pipe([
  defaultsDeep({ profile: "default" }),
  assign({
    currentRegion: getCurrentRegion,
  }),
  switchCase([
    get("currentRegion"),
    pipe([
      assign({
        moreRegions: confirmMoreRegion,
      }),
    ]),
    pipe([assign({ moreRegions: () => true })]),
  ]),
  switchCase([
    get("moreRegions"),
    // Select more regions
    pipe([
      assign({
        regionsAvailable: describeRegions,
      }),
      selectRegions,
    ]),
    // Just choose the configured region
    pipe([
      tap(({ currentRegion }) => {
        assert(currentRegion);
      }),
      pipe([({ currentRegion }) => [currentRegion]]),
    ]),
  ]),
  tap((params) => {
    assert(true);
  }),
]);
