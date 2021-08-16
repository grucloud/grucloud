module.exports = ({ stage }) => ({
  projectName: "example-grucloud-ssm-parameter",
  ssm: {
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
