exports.configTpl = ({
  content,
  projectName,
  projectId,
}) => `module.exports = ({ stage }) => ({
  projectName: "${projectName}",
  projectId: "${projectId}",
  ${content}
});`;
