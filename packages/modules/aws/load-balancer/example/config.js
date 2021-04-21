module.exports = ({}) => ({
  projectName: "load-balancer-example",
  eks: { cluster: { name: `cluster` } },
  certificate: {
    rootDomainName: "grucloud.org",
    domainName: "mod-aws-load-balancer.grucloud.org",
  },
});
