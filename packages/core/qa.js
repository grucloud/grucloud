const assert = require("assert");
const { pipe, map, tap, and, get } = require("rubico");
const { isEmpty, first, callProp } = require("rubico/x");

const { Cli } = require("./cli/cliCommands");
const { retryCall } = require("./Retry");
const isEmptyPlan = pipe([
  get("resultQuery.results[0]"),
  and([
    pipe([get("resultCreate"), isEmpty]),
    pipe([get("resultDestroy"), isEmpty]),
  ]),
]);
exports.testEnd2End = ({ programOptions, title, listOptions, steps = [] }) =>
  pipe([
    () => steps,
    first,
    tap((step) => {
      assert(step, `missing first step`);
    }),
    ({ createStack, createResources, configs }) =>
      Cli({ programOptions, createStack, createResources, configs }),
    (cli) =>
      pipe([
        () => cli.info({}),
        tap((params) => {
          assert(true);
        }),
        () =>
          cli.graphTree({
            commandOptions: { title },
            programOptions: { noOpen: true },
          }),
        () =>
          cli.graphTarget({
            commandOptions: { title },
            programOptions: { noOpen: true },
          }),
        () =>
          cli.planDestroy({
            commandOptions: { force: true },
          }),
        () =>
          cli.list({
            commandOptions: {
              our: true,
              canBeDeleted: true,
              json: "artifacts/inventoryAfterDestroy.json",
            },
          }),
        () =>
          cli.planApply({
            commandOptions: { force: true },
          }),
        () =>
          cli.list({
            commandOptions: { our: true, canBeDeleted: true },
          }),
        () =>
          retryCall({
            name: `planQuery`,
            fn: pipe([() => ({}), cli.planQuery]),
            config: { repeatCount: 1, retryDelay: 5e3 },
            isExpectedResult: isEmptyPlan,
          }),
        () =>
          cli.list({
            programOptions: {
              json: "artifacts/inventory.json",
              noOpen: true,
            },
            commandOptions: {
              typesExclude: ["EC2::NetworkInterface"],
              ...listOptions,
            },
          }),
        () =>
          cli.genCode({
            commandOptions: {
              input: "artifacts/inventory.json",
              outputCode: "artifacts/resources.js",
            },
          }),
        () =>
          cli.list({
            programOptions: {
              json: "artifacts/inventory.json",
              noOpen: true,
            },
            commandOptions: {
              graph: true,
              typesExclude: ["EC2::NetworkInterface"],
              ...listOptions,
            },
          }),
        () => steps,
        callProp("splice", 1),
        tap((params) => {
          assert(true);
        }),
        map.series(({ createStack, createResources, configs }) =>
          pipe([
            () =>
              Cli({ programOptions, createStack, createResources, configs }),
            (cliNext) =>
              pipe([
                () => cliNext.info({}),
                tap((params) => {
                  assert(true);
                }),
                () =>
                  cliNext.planApply({
                    commandOptions: { force: true },
                  }),
                () =>
                  cli.list({
                    commandOptions: {
                      canBeDeleted: true,
                      json: "artifacts/inventoryAfterUpdate.json",
                    },
                  }),
                () =>
                  retryCall({
                    name: `planQuery`,
                    fn: pipe([() => ({}), cliNext.planQuery]),
                    config: { repeatCount: 1, retryDelay: 5e3 },
                    isExpectedResult: isEmptyPlan,
                  }),
              ])(),
          ])()
        ),
        () =>
          cli.planDestroy({
            commandOptions: { force: true },
          }),
        () =>
          cli.list({
            commandOptions: { canBeDeleted: true, defaultExclude: true },
            json: "artifacts/inventoryAfterDestroy.json",
          }),
      ])(),
  ])();
