exports.configTpl = ({
  content,
  projectName,
}) => `module.exports = ({ stage }) => ({
  projectName: "${projectName}",
  ${content}
});`;
