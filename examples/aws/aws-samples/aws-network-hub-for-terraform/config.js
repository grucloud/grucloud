const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  organisationManagement:
    "arn:aws:organizations::840541460064:organization/o-xs8pjirjbw",
});
