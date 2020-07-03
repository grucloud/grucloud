module.exports = {
  title: "GruCloud",
  tagline: "Infrastructure as Code",
  url: "https://grucloud.com",
  baseUrl: "/",
  favicon: "img/cloud.svg",
  organizationName: "fredericheem", // Usually your GitHub org/user name.
  projectName: "grucloud", // Usually your repo name.
  themeConfig: {
    navbar: {
      title: "GruCloud",
      logo: {
        alt: "GruCloud Logo",
        src: "img/cloud.svg",
      },
      links: [
        {
          to: "docs/TLDR",
          activeBasePath: "docs",
          label: "Docs",
          position: "left",
        },
        /*{ to: "blog", label: "Blog", position: "left" },*/
        {
          href: "https://github.com/fredericheem/grucloud",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        /*{
          title: "Docs",
          items: [
            {
              label: "Style Guide",
              to: "docs/doc1",
            },
            {
              label: "Second Doc",
              to: "docs/doc2",
            },
          ],
        },*/
        /*{
          title: "Community",
          items: [
            {
              label: "Stack Overflow",
              href: "https://stackoverflow.com/questions/tagged/docusaurus",
            },
            {
              label: "Discord",
              href: "https://discordapp.com/invite/docusaurus",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/docusaurus",
            },
          ],
        },*/
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
