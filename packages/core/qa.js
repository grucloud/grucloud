const assert = require("assert");
const { pipe, map, tap, and, get } = require("rubico");
const { isEmpty, first, callProp } = require("rubico/x");

const { Cli } = require("./cli/cliCommands");

const isEmptyPlan = pipe([
  get("resultQuery.results[0]"),
  and([
    pipe([get("resultCreate"), isEmpty]),
    pipe([get("resultDestroy"), isEmpty]),
  ]),
]);
exports.testEnd2End = ({
  programOptions,
  title,
  listOptions,
  steps = [],
  noEmptyPlanCheck,
}) =>
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
            commandOptions: { our: true, canBeDeleted: true },
          }),
        () =>
          cli.planApply({
            commandOptions: { force: true },
          }),
        () => cli.planQuery({}),
        tap((result) => {
          assert(isEmptyPlan(result), "plan should be empty after first apply");
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
              defaultExclude: true,
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
            () => Cli({ programOptions, createStack, createResources, configs }),
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
                      defaultExclude: true,
                    },
                  }),
                () => cliNext.planQuery({}),
                tap((result) => {
                  !noEmptyPlanCheck &&
                    assert(
                      isEmptyPlan(result),
                      "plan should be empty after an update"
                    );
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
          }),
      ])(),
  ])();
