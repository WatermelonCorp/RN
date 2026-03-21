import { PageHeader } from "@/components/core/typography";
import { CodeBlock } from "@/components/showcase/code-block";
import MotionDiv from "@/components/core/motion-div";
import {
  DocSection,
  OnThisPage,
} from "@/components/showcase/docs-primitives";

const toc = [
  { id: "initialize", title: "Initialize" },
  { id: "config-file", title: "Config file" },
];

export default function InstallationPage() {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      transition={{ duration: 0.3 }}
      className="mr-auto max-w-5xl space-y-8"
    >
      <OnThisPage items={toc} />

      <PageHeader
        badge="Installation"
        title="Set up Watermelon in a React Native project."
        subTitle="Initialize the project once, then add only the registry primitives you want. The CLI handles file output and package dependencies."
      />

      <DocSection id="initialize" title="Initialize">
        <CodeBlock language="bash" title="Initialize" showLineNumbers={false}>
          {`watermelon init
watermelon add button text`}
        </CodeBlock>
      </DocSection>

      <DocSection id="config-file" title="Config file">
        <CodeBlock language="json" title="watermelon.json">
          {`{
  "style": "default",
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "global.css",
    "baseColor": "slate"
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}`}
        </CodeBlock>
      </DocSection>
    </MotionDiv>
  );
}
