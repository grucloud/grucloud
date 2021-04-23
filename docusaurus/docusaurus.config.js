module.exports = {
  title: "GruCloud",
  tagline: "Infrastructure as Code",
  url: "https://grucloud.github.io/",
  baseUrl: "/",
  favicon: "img/cloud.svg",
  organizationName: "grucloud", // Usually your GitHub org/user name.
  projectName: "grucloud", // Usually your repo name.
  plugins: ["@docusaurus/plugin-google-gtag"],
  themeConfig: {
    disableDarkMode: true,
    gtag: {
      trackingID: "UA-179962442-1",
      anonymizeIP: true,
    },
    navbar: {
      title: "GruCloud",
      logo: {
        alt: "GruCloud Logo",
        src: "img/cloud.svg",
      },
      links: [
        {
          to: "docs/Introduction",
          activeBasePath: "docs",
          label: "Docs",
          position: "left",
        },
        /*{ to: "blog", label: "Blog", position: "left" },*/
        {
          href: "https://github.com/grucloud/grucloud",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      links: [
        {
          title: "Community",
          items: [
            {
              label: "Twitter",
              href: "https://twitter.com/grucloud_iac",
            },
            {
              label: "Stack Overflow",
              href: "https://stackoverflow.com/questions/tagged/grucloud",
            },
            {
              label: "Discord",
              href:
                "https://discord.com/channels/803645280359546920/803645355606147082",
            },
          ],
        },
        {
          title: "Documentation",
          items: [
            {
              label: "AWS",
              href: "/docs/aws/AwsGettingStarted",
            },
            {
              label: "Google Cloud",
              href: "/docs/google/GoogleGettingStarted",
            },
            {
              label: "Microsoft Azure",
              href: "/docs/azure/AzureGettingStarted",
            },
            {
              label: "Kubernetes",
              href: "/docs/k8s/K8sGettingStarted",
            },
          ],
        },
        /*{
          title: "More",
          items: [
            {
              label: "Blog",
              to: "blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/facebook/docusaurus",
            },
          ],
        },*/
      ],
      copyright: `Copyright © ${new Date().getFullYear()} GruCloud`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          /*editUrl: "https://github.com/fredericheem/grucloud",*/
        },
        /*blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            "https://github.com/facebook/docusaurus/edit/master/website/blog/",
        },*/
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
