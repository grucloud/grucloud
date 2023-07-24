import hero from "./Hero";
import features from "./Features";
import gettingStarted from "./GettingStarted";
import gcCommands from "./GcCommands";

export default function (context) {
  const { bau, css } = context;
  const { div, span, a, p } = bau.tags;
  const Hero = hero(context);
  const Features = features(context);
  const GettingStarted = gettingStarted(context);
  const GcCommands = gcCommands(context);

  const className = css`
    grid-area: main;
  `;

  const featuresContent = [
    {
      title: "Features",
      Content: () => [
        p("Generate code from live infrastructures."),
        p("Deploy, destroy and list resources on various clouds."),
        p("Share and compose infrastructure."),
        p("Automatic resource dependencies management."),
      ],
    },
    {
      title: "Benefit",
      Content: () => [
        p("Skip manually coding your infrastructure."),
        p("Stop paying for ununsed resources. Re-deploy them when necessary."),
        p("Predictable deployment."),
        p("Create various deployment stages: production, uat, test, etc ..."),
      ],
    },
    {
      title: "Tech",
      Content: () => [
        p(
          "Use Javascript, a true programming language, no more YAML or Domain Specific language."
        ),
        p("Easy to add new resources or new cloud providers."),
        p("Robust against cloud service providers API failures"),
        p("Open Source."),
      ],
    },
  ];

  return function Main({}) {
    return div(
      {
        class: className,
      },
      Hero({
        name: "GruCloud",
        text: "Infrastructure as Generated Code",
        tagLine: "Bidirectional Infrastructure as Code Tool",
      }),
      Features({ featuresContent }),
      GettingStarted(),
      GcCommands()
    );
  };
}
