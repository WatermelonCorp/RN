import MotionDiv from "@/components/core/motion-div";
import { PageHeader } from "@/components/core/typography";
import { CodeBlock } from "@/components/showcase/code-block";
import {
  DocSection,
  OnThisPage,
} from "@/components/showcase/docs-primitives";

const toc = [
  { id: "overview", title: "Overview" },
  { id: "directory-entry", title: "Directory entry" },
  { id: "component-manifest", title: "Component manifest" },
  { id: "hosting-behavior", title: "Hosting behavior" },
  { id: "install-from-registry", title: "Install from registry" },
  { id: "pr-checklist", title: "PR checklist" },
];

export default function RegistryPage() {
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
        badge="Registry"
        title="Publish your own registry and get it approved."
        subTitle="Watermelon can consume third-party registries as long as they follow the expected directory entry and component manifest format. Once your registry is live, open a PR to add it to our approved directory."
      />

      <DocSection id="overview" title="Overview">
        <div className="space-y-3 text-sm leading-7 text-muted-foreground">
          <p>
            The CLI failed earlier because the default registry URL was pointing
            to a domain that did not exist yet. The fix is not just “host some
            JSON somewhere”. A registry needs a stable manifest URL pattern,
            file hosting that matches the manifest, and a scope entry we can
            review and approve.
          </p>
          <p>
            If you want your website to work with Watermelon, publish a
            registry on your own domain, make sure the component manifests
            resolve correctly, and then submit a PR that adds your directory
            entry to our approved registry list.
          </p>
        </div>
      </DocSection>

      <DocSection id="directory-entry" title="Directory entry">
        <CodeBlock language="json" title="Directory Entry">
          {`{
  "name": "@your-scope",
  "homepage": "https://your-site.com",
  "url": "https://your-site.com/r/{name}.json",
  "description": "Short summary of your component registry."
}`}
        </CodeBlock>

        <div className="space-y-3 text-sm leading-7 text-muted-foreground">
          <p>
            The <code>name</code> is the namespace users type in the CLI, for
            example <code>watermelon add @your-scope/card</code>. The{" "}
            <code>url</code> field is a template. Watermelon replaces{" "}
            <code>{"{name}"}</code> with the requested component name.
          </p>
          <p>
            If your registry does not use a template and instead exposes a flat
            base URL, you can still host manifests at <code>/button.json</code>
            , <code>/card.json</code>, and so on. The shadcn-style template
            above is the preferred format because it is more explicit and
            easier to review.
          </p>
        </div>
      </DocSection>

      <DocSection id="component-manifest" title="Component manifest">
        <CodeBlock language="json" title="Component Manifest">
          {`{
  "name": "button",
  "dependencies": ["clsx", "tailwind-merge"],
  "registryDependencies": ["text"],
  "files": [
    {
      "path": "components/ui/button.tsx",
      "url": "https://your-site.com/files/components/ui/button.tsx"
    }
  ]
}`}
        </CodeBlock>

        <div className="space-y-3 text-sm leading-7 text-muted-foreground">
          <p>
            Each manifest must include a valid <code>name</code> and at least
            one <code>files</code> entry. <code>dependencies</code> are npm
            packages the CLI installs automatically.{" "}
            <code>registryDependencies</code> are other registry components
            that should be installed first.
          </p>
          <p>
            Each file needs a target <code>path</code>. You can also provide an
            explicit <code>url</code>. If you omit the file URL, Watermelon
            falls back to the conventional <code>/files/&lt;path&gt;</code>{" "}
            pattern.
          </p>
        </div>
      </DocSection>

      <DocSection id="hosting-behavior" title="Hosting behavior">
        <CodeBlock
          language="text"
          title="Required Hosting Behavior"
          showLineNumbers={false}
        >
          {`GET https://your-site.com/r/button.json
GET https://your-site.com/r/card.json
GET https://your-site.com/files/components/ui/button.tsx
GET https://your-site.com/files/components/ui/card.tsx`}
        </CodeBlock>

        <div className="space-y-3 text-sm leading-7 text-muted-foreground">
          <p>
            Your hosted responses should be public, stable, and return valid
            JSON or file contents without requiring a browser session. Avoid
            URLs that depend on temporary tokens, client-side rendering, or
            HTML wrappers.
          </p>
        </div>
      </DocSection>

      <DocSection id="install-from-registry" title="Install from registry">
        <CodeBlock
          language="bash"
          title="How Users Install From Your Registry"
          showLineNumbers={false}
        >
          {`watermelon add @your-scope/button
watermelon add @your-scope/card --dry-run
watermelon add @your-scope/button @your-scope/text`}
        </CodeBlock>
      </DocSection>

      <DocSection id="pr-checklist" title="PR checklist">
        <CodeBlock
          language="markdown"
          title="PR Checklist"
          showLineNumbers={false}
        >
          {`- Host your manifests on a public domain you control.
- Serve a directory entry with a stable \`url\` template.
- Make every component manifest return valid JSON.
- Make every file URL downloadable directly.
- Include clear descriptions and ownership details.
- Open a PR adding your registry entry to the approved directory.
- We test the URLs, review the output, and approve if everything resolves correctly.`}
        </CodeBlock>
      </DocSection>
    </MotionDiv>
  );
}
