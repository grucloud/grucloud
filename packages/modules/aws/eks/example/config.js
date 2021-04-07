const pkg = require("./package.json");

module.exports = ({}) => {
  return {
    projectName: pkg.name,
  };
};
