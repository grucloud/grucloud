module.exports = ({ stage }) => ({
  projectName: "example-grucloud-ssm-parameter",
  SSM: {
    Parameter: {
      textParam: {
        name: "text-param",
        properties: {
          Type: "String",
          Value: "my-value",
          DataType: "text",
          Tags: [
            {
              Key: "TOTOKEY",
              Value: "TOTOVALUE",
            },
          ],
        },
      },
    },
  },
});
