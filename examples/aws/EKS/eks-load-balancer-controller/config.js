const pkg = require("./package.json");

module.exports = ({}) => {
  return {
    projectName: "eks",
    //    formatName: (name, config) => `${name}-${config.projectName}`,
    formatName: (name, config) => name,
  };
};
