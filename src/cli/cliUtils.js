const ora = require("ora");

exports.runAsyncCommand = async (command, text) => {
  //console.log(`runAsyncCommand ${text}`);
  const throbber = ora({
    text: `${text}\n`,
    spinner: {
      frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
      interval: 300,
    },
  }).start();

  try {
    const result = await command();
    return result;
  } catch (error) {
    throw error;
  } finally {
    // TODO check if it is called
    throbber.stop();
  }
};
