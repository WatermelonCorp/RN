import { PageHeader } from "@/components/core/typography";
import { CodeBlock } from "@/components/showcase/code-block";
import MotionDiv from "@/components/core/motion-div";
import {
  DocSection,
  OnThisPage,
} from "@/components/showcase/docs-primitives";

const toc = [{ id: "commands", title: "Commands" }];

export default function CliPage() {
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
        badge="CLI"
        title="Add components one command at a time."
        subTitle="The CLI resolves registry dependencies, installs npm packages, and writes transformed component files into your project structure."
      />

      <DocSection id="commands" title="Commands">
        <CodeBlock language="bash" title="Commands" showLineNumbers={false}>
          {`watermelon init
watermelon add button
watermelon add button text`}
        </CodeBlock>
      </DocSection>
    </MotionDiv>
  );
}
