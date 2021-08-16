module.exports = ({ stage }) => ({
  projectName: "example-grucloud-ssm-parameter",
  ssm: {
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
