module.exports = ({ stage }) => ({
  projectName: "example-grucloud-ecs-simple",
  includeGroups: ["AutoScaling", "CloudWatch", "EC2", "ECS"],
});
