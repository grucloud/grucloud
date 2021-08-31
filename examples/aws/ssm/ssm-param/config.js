module.exports = ({ stage }) => ({
  projectName: "example-grucloud-ssm-parameter",
  SSM: {
    Parameter: {
      textParam: {
        name: "text-param",
        properties: {
          Type: "String",
          Value: "my-value",
          Description: "a textual parameter",
          Tier: "Standard",
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
