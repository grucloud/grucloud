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
  const result = await command();
  throbber.stop();
  return result;
};
