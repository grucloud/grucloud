const assert = require("assert");
const {
  map,
  pipe,
  tap,
  eq,
  get,
  tryCatch,
  switchCase,
  assign,
} = require("rubico");
const { find, isEmpty, unless } = require("rubico/x");
const shell = require("shelljs");
const Spinnies = require("spinnies");

const onDoneDefault = ({ uri, displayText, state, spinnies, spinnerMap }) => {
  assert(uri);
  assert(spinnies);
  assert(spinnerMap);
  assert(displayText);

  spinnies.update(uri, {
    text: displayText(state),
    status: "succeed",
  });

  spinnerMap.delete(uri);
};

const onErrorDefault = ({ uri, spinnerMap }) => {
  assert(uri);
  assert(spinnerMap);
  spinnerMap.delete(uri);
};

const onStateChange =
  ({ spinnies, spinnerMap }) =>
  ({ context, previousState, nextState, error = {}, indent }) => {
    assert(context, "onStateChange: missing context");

    const {
      uri,
      displayText,
      onDone = onDoneDefault,
      onError = onErrorDefault,
    } = context;

    assert(displayText, "onStateChange: missing context displayText");
    assert(uri, "onStateChange: missing context uri");

    if (process.env.CONTINUOUS_INTEGRATION) {
      return;
    }

    switch (nextState) {
      case "WAITING": {
        assert(!spinnies.pick(uri), `${uri} already created`);
        spinnerMap.set(uri, { state: context.state });
        spinnies.add(uri, {
          text: displayText(context.state),
          indent,
          color: "yellow",
        });
        break;
      }
      case "RUNNING": {
        const spinner = spinnerMap.get(uri);
        if (!spinner) {
          return;
        }
        const spinny = spinnies.pick(uri);
        assert(spinny, `spinnies create in running state: ${uri}`);
        spinnies.update(uri, {
          text: displayText(spinner.state),
          color: "blue",
          status: "spinning",
        });
        break;
      }
      case "DONE": {
        const spinny = spinnies.pick(uri);
        if (!spinny) {
          return;
        }
        const spinner = spinnerMap.get(uri);
        if (!spinner) {
          return;
        }
        onDone({
          uri,
          displayText,
          state: spinner.state,
          spinnerMap,
          spinnies,
        });
        break;
      }
      case "ERROR": {
        const spinny = spinnies.pick(uri);
        if (!spinny) {
          return;
        }
        assert(error, `should have set the error, id: ${uri}`);
        const spinner = spinnerMap.get(uri);
        if (!spinner) {
          return;
        }

        const textWithError = `${displayText(spinner.state).padEnd(30, " ")} ${
          error.Message || ""
        } ${error.message || ""}`;

        spinnies.fail(uri, { text: textWithError });
        onError({
          uri,
          displayText,
          state: spinner.state,
          spinnerMap,
          spinnies,
        });
        break;
      }
      default:
        assert(false, `unknown state ${nextState}`);
    }
  };

const executeCommand = ({ command, environment }) =>
  pipe([
    tap((directory) => {
      assert(environment);
      assert(command);
      assert(directory);
    }),
    (directory) =>
      new Promise((resolve, reject) => {
        shell.exec(
          command,
          {
            silent: true,
            async: true,
            cwd: directory,
            env: { ...process.env, AWS_PROFILE: environment.awsAccount },
          },
          (code, stdout, stderr) =>
            pipe([
              tap(() => {
                assert(true);
              }),
              switchCase([
                () => code === 0,
                pipe([() => stdout, resolve]),
                pipe([() => stderr, reject]),
              ]),
            ])()
        );
      }),
    tap((directory) => {
      assert(directory);
    }),
  ]);

const buildContext = ({ directory, name }) => ({
  uri: directory,
  displayText: () => name,
});

const runCommandWrapper = ({
  resultMap,
  command,
  environment,
  onStateChange,
}) =>
  pipe([
    tap(({ directory, name }) => {
      assert(environment);
      assert(command);
      assert(directory);
      assert(name);
      assert(resultMap);
      assert(onStateChange);
    }),
    tryCatch(
      ({ directory, name }) =>
        pipe([
          tap(() => {
            resultMap.set(directory, { state: "running" });
            onStateChange({
              context: buildContext({ directory, name }),
              nextState: "WAITING",
            });
            onStateChange({
              context: buildContext({ directory, name }),
              nextState: "RUNNING",
            });
          }),
          () => directory,
          executeCommand({ command, environment }),
          tap(() => {
            resultMap.set(directory, { state: "done" });
            onStateChange({
              context: buildContext({ name, directory }),
              nextState: "DONE",
            });
          }),
        ])(),
      (error, { directory, name }) =>
        pipe([
          tap(() => {
            resultMap.set(directory, { state: "error", error });
            onStateChange({
              context: buildContext({ name, directory }),
              nextState: "ERROR",
              error,
            });
          }),
        ])()
    ),
    () => ({ resultMap }),
    findNextDirectory,
    switchCase([
      isEmpty,
      () => ({ resultMap }),
      pipe([
        // Recursive
        (params) =>
          runCommandWrapper({ command, resultMap, environment, onStateChange })(
            params
          ),
      ]),
    ]),
  ]);

const findNextDirectory = ({ resultMap }) =>
  pipe([() => [...resultMap.values()], find(eq(get("state"), "init"))])();

const createSpinnies = () =>
  new Spinnies({
    spinner: {
      interval: 300,
      frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
    },
  });

exports.testRunner =
  ({ command, environments }) =>
  (testSuite) =>
    pipe([
      tap((params) => {
        assert(environments);
        assert(command);
        assert(testSuite);
      }),
      () => testSuite,
      map(({ directory, name }) => [
        directory,
        { state: "init", directory, name },
      ]),
      (mapInit) => ({
        resultMap: new Map(mapInit),
        spinnies: createSpinnies(),
        spinnerMap: new Map(),
      }),
      assign({
        onStateChange,
      }),
      tap(({ resultMap, onStateChange }) =>
        pipe([
          () => environments,
          map((environment) =>
            pipe([
              () => ({ resultMap }),
              findNextDirectory,
              unless(
                isEmpty,
                runCommandWrapper({
                  command,
                  resultMap,
                  environment,
                  onStateChange,
                })
              ),
            ])()
          ),
        ])()
      ),
      tap(({ spinnies, resultMap }) => {
        spinnies.stopAll();
      }),
    ])();
