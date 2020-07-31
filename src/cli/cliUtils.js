const Spinnies = require("spinnies");
const assert = require("assert");
const logger = require("../logger")({ prefix: "CliUtils" });
const { tos } = require("../tos");

const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

const spinner = { interval: 300, frames };

exports.runAsyncCommand = async ({ text, command }) => {
  console.log(`${text}`);
  assert(text);
  assert(command);
  const spinnies = new Spinnies({ spinner });
  logger.debug(`runAsyncCommand: ${JSON.stringify({ text })}`);
  const spinnerList = [];
  const spinnerMap = new Map();

  const onStateChange = ({
    context,
    previousState,
    nextState,
    error = {},
    indent,
    ...other
  }) => {
    logger.debug(
      `onStateChange: ${tos({
        context,
        previousState,
        nextState,
        other,
      })}`
    );

    if (!context) {
      assert(false, "onStateChange: missing context");
    }
    const { uri, display } = context;

    if (!uri) {
      assert(false, "onStateChange: missing context uri");
    }
    const text = display || uri;

    switch (nextState) {
      case "WAITING": {
        logger.debug(`spinnies: create uri: ${uri}, text: ${text}`);
        spinnerList.push(uri);

        const spinny = spinnies.pick(uri);
        if (spinny) {
          assert(false, `${uri} already created`);
        }
        spinnerMap.set(uri, spinny);
        spinnies.add(uri, {
          text,
          indent,
          color: "yellow",
        });
        break;
      }
      case "RUNNING": {
        logger.debug(`spinnies running uri: ${uri}, text: ${text}`);
        const spinny = spinnies.pick(uri);
        const runningColor = "greenBright";
        if (spinny) {
          if (spinner.status === "spinning") {
            assert(false, `${uri} already spinning`);
          }
          spinnies.update(uri, {
            text,
            color: runningColor,
            status: "spinning",
          });
        } else {
          assert(
            false,
            `spinnies create in running state: ${uri}, spinnerList: ${spinnerList.join(
              "\n"
            )}`
          );
          spinnies.add(uri, { text, color: runningColor, indent });
        }
        break;
      }
      case "DONE": {
        const spinny = spinnies.pick(uri);
        if (spinny) {
          spinnies.succeed(uri);
        } else {
          assert(false, `DONE event: ${uri} was not created`);
        }
        spinnerMap.delete(uri, spinny);
        break;
      }
      case "ERROR": {
        //TODO build error.ToString()

        const spinny = spinnies.pick(uri);
        if (spinny) {
          assert(error, `should have set the error, id: ${uri}`);
          const textWithError = `${text.padEnd(30, " ")} ${
            error.Message || ""
          } ${error.message || ""}`;
          logger.error(textWithError);
          spinnies.fail(uri, { text: textWithError });
        } else {
          assert(false, `ERROR event: ${uri} was not created, error: ${error}`);
        }
        spinnerMap.delete(uri, spinny);
        break;
      }
      default:
        assert(false, `unknown state ${nextState}`);
        break;
    }
  };

  try {
    const result = await command({ onStateChange });
    logger.debug(`runAsyncCommand end of : ${text}`);
    [...spinnerMap.keys()].forEach((name) => {
      logger.error(`spinners still running: ${name}`);
      console.log(`spinners still running: ${name}`);
    });
    assert.equal(spinnerMap.size, 0, "spinner still active");
    spinnies.stopAll();
    return result;
  } catch (error) {
    spinnies.stopAll();
    logger.debug(`runAsyncCommand: error for command: ${text}`);
    logger.debug(error);

    throw error;
  }
};
