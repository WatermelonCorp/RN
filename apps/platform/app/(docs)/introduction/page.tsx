import MotionDiv from "@/components/core/motion-div";
import { PageHeader } from "@/components/core/typography";
import { CodeBlock } from "@/components/showcase/code-block";
import {
  DocSection,
  DocSubsection,
  OnThisPage,
} from "@/components/showcase/docs-primitives";

const toc = [
  { id: "what-is-watermelon", title: "What is Watermelon?" },
  { id: "why-it-exists", title: "Why it exists" },
  { id: "workflow", title: "Typical workflow" },
  { id: "pick-components", title: "Pick components", depth: 3 },
  { id: "install-with-cli", title: "Install with CLI", depth: 3 },
  { id: "customize-output", title: "Customize output", depth: 3 },
  { id: "project-shape", title: "Project shape" },
  { id: "next-steps", title: "Next steps" },
];

export default function IntroductionPage() {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      transition={{ duration: 0.3 }}
      className="mr-auto max-w-5xl space-y-10"
    >
      <OnThisPage items={toc} />

      <PageHeader
        badge="Introduction"
        title="Build React Native interfaces with a registry-first workflow."
        subTitle="Watermelon brings a shadcn-style installation flow to React Native so you can add only the primitives you need, keep the source in your app, and customize the output without fighting a black-box package."
      />

      <DocSection id="what-is-watermelon" title="What is Watermelon?">
        <p className="text-muted-foreground text-sm leading-7">
          Watermelon is a React Native component registry and CLI. Instead of
          shipping one giant UI dependency, it lets you pull installable
          primitives like <code>button</code> and <code>text</code> directly
          into your project.
        </p>
        <p className="text-muted-foreground text-sm leading-7">
          The result is a docs-and-registry workflow that feels familiar if you
          have used shadcn on the web, but tuned for native app structure,
          NativeWind styling, and Expo-friendly local development.
        </p>
      </DocSection>

      <DocSection id="why-it-exists" title="Why it exists">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border-border/70 bg-card/70 rounded-2xl border p-5">
            <h3 className="text-base font-medium">Own the code</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-7">
              Installed components live in your codebase, so refactors,
              animations, and design tweaks stay under your control.
            </p>
          </div>
          <div className="border-border/70 bg-card/70 rounded-2xl border p-5">
            <h3 className="text-base font-medium">Install incrementally</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-7">
              Start with a couple of primitives, then layer in more only when
              the product actually needs them.
            </p>
          </div>
          <div className="border-border/70 bg-card/70 rounded-2xl border p-5">
            <h3 className="text-base font-medium">Keep docs close</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-7">
              Every component has install commands, examples, previews, and API
              notes in the same documentation flow.
            </p>
          </div>
          <div className="border-border/70 bg-card/70 rounded-2xl border p-5">
            <h3 className="text-base font-medium">Stay native-first</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-7">
              The primitives are designed for React Native and Expo rather than
              being thin ports of web-only assumptions.
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection id="workflow" title="Typical workflow">
        <DocSubsection id="pick-components" title="Pick components">
          <p className="text-muted-foreground text-sm leading-7">
            Browse the registry, open the docs for a primitive, and verify that
            its API and visual behavior match the surface you are building.
          </p>
        </DocSubsection>

        <DocSubsection id="install-with-cli" title="Install with CLI">
          <p className="text-muted-foreground text-sm leading-7">
            Initialize your project once, then add primitives whenever you need
            them.
          </p>
          <CodeBlock language="bash" title="CLI workflow" showLineNumbers={false}>
            {`watermelon init
watermelon add button text`}
          </CodeBlock>
        </DocSubsection>

        <DocSubsection id="customize-output" title="Customize output">
          <p className="text-muted-foreground text-sm leading-7">
            After installation, the files are yours. Adjust variants, spacing,
            tokens, or composition patterns to fit your product instead of
            waiting on a package release.
          </p>
        </DocSubsection>
      </DocSection>

      <DocSection id="project-shape" title="Project shape">
        <p className="text-muted-foreground text-sm leading-7">
          A typical setup keeps UI primitives in a local component directory,
          uses a shared utility helper, and points Tailwind or NativeWind to the
          right sources.
        </p>
        <CodeBlock language="text" title="Example structure" showLineNumbers={false}>
          {`app/
components/
  ui/
    button.tsx
    text.tsx
lib/
  utils.ts
global.css
watermelon.json`}
        </CodeBlock>
      </DocSection>

      <DocSection id="next-steps" title="Next steps">
        <p className="text-muted-foreground text-sm leading-7">
          Start with the installation guide if you are setting up a fresh app,
          or jump into the components catalog if you already want to pull in a
          primitive and begin customizing it.
        </p>
      </DocSection>
    </MotionDiv>
  );
}
