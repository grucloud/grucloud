import highlightContainer from "./highlightContainer";

export default function (context) {
  const { bau, css } = context;
  const { article, a, code, div, em, h1, h2, iframe, img, p, section, pre } =
    bau.tags;

  const HighlightContainer = highlightContainer(context);
  const className = css`
    padding: 1rem;
  `;

  return function GcCommands() {
    return article(
      { class: className },
      section(
        h2("Generate code from a live infrastructure."),
        p(
          "Manually writing infrastructure code is time consuming and require expertise. The code generation feature frees you from this tedious task."
        ),
        p(
          "The ",
          code("gc gencode"),
          " command fetches the current state of the infrastructure and generate the ",
          code("resources.js"),
          " file."
        ),
        HighlightContainer()
      ),
      section(
        h2("Visualize the resources"),
        p(
          "The ",
          code("gc list --graph"),
          " command displays a graph of the live infrastructure showing the dependencies between resources.  "
        ),
        div(
          img({
            src: "https://raw.githubusercontent.com/grucloud/grucloud/main/examples/aws/EC2/Instance/ec2-vpc/artifacts/diagram-live.svg",
            alt: "graph",
          })
        )
      ),
      section(
        h2("Visualize as a mindmap"),
        p(
          "The ",
          code("gc tree"),
          " command displays a mindmap resources types.  "
        ),
        div(
          img({
            src: "https://raw.githubusercontent.com/grucloud/grucloud/main/examples/aws/EC2/Instance/ec2-vpc/artifacts/resources-mindmap.svg",
            alt: "graph",
          })
        )
      ),
      section(
        h2("GruCloud Command Line Interface"),
        p(
          "Use the ",
          em("gc"),
          " command line interface to deploy and destroy the infrastructure: ",
          a(
            {
              href: "https://www.grucloud.com/docs/cli/gc",
            },
            "visit the GruCloud CLI documentation"
          )
        )
      ),
      section(
        h2("Book a demo"),
        p(
          "Send an email to ",
          a(
            { href: "mailto:hello@grucloud.com?subject=Demo request" },
            "hello@grucloud.com"
          ),
          " for more information about a personal demo"
        )
      )
    );
  };
}
