const assert = require("assert");
const { pipe, map, tap, and, get, tryCatch } = require("rubico");
const { isEmpty, first, callProp } = require("rubico/x");
const logger = require("./logger")({ prefix: "ProviderGru" });

const { Cli } = require("./cli/cliCommands");
const { retryCall } = require("./Retry");
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
  doGraph = !process.env.CONTINUOUS_INTEGRATION,
}) =>
  tryCatch(
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
          tap.if(
            () => doGraph,
            () =>
              cli.graphTree({
                commandOptions: { title },
                programOptions: { noOpen: true },
              })
          ),
          tap.if(
            () => doGraph,
            () =>
              cli.graphTarget({
                commandOptions: { title },
                programOptions: { noOpen: true },
              })
          ),
          () =>
            cli.planDestroy({
              commandOptions: { force: true, all: true },
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
                inventory: "artifacts/inventory.json",
                outputCode: "artifacts/resources.js",
                prompt: false,
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
    ]),
    (error) => {
      logger.error("Error running tests:");
      logger.error(JSON.stringify(error, null, 4));
      logger.error(error.stack);
      throw error;
    }
  )();
