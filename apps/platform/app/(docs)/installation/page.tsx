import { PageHeader, SubTitle, Title } from "@/components/core/typography";
import { CodeBlock } from "@/components/showcase/code-block";
import MotionDiv from "@/components/core/motion-div";

export default function InstallationPage() {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      transition={{ duration: 0.3 }}
      className="mr-auto max-w-5xl space-y-8"
    >
      <PageHeader
        badge="Installation"
        title="Set up Watermelon in a React Native project."
        subTitle="Initialize the project once, then add only the registry primitives you want. The CLI handles file output and package dependencies."
      />

      <CodeBlock language="bash" title="Initialize" showLineNumbers={false}>
        {`watermelon init
watermelon add button text`}
      </CodeBlock>

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
    </MotionDiv>
  );
}
