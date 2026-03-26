"use client";

import { useState } from "react";
import {
  InstallationCmd,
  type InstallationItem,
} from "@/components/mdx/installation-cmd";
import { ManualInstallationCmd } from "@/components/mdx/manual-installation";
import { CodeBlock } from "@/components/showcase/code-block";
import { DocsStep, DocsSteps } from "@/components/showcase/docs-steps";

type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

interface ComponentInstallationProps {
  item: InstallationItem;
  dependencies?: string[];
}

function toImportName(value: string) {
  return value
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((segment) => {
      return segment.charAt(0).toUpperCase() + segment.slice(1);
    })
    .join("");
}

export function ComponentInstallation({
  item,
  dependencies,
}: ComponentInstallationProps) {
  const [activePackageManager, setActivePackageManager] =
    useState<PackageManager>("npm");
  const importName = toImportName(item.name);
  const importSnippet = `import { ${importName} } from "${item.importPath ?? `@/components/ui/${item.slug}`}";`;
  const steps = [
    {
      title: "Install the component",
      description: (
        <p>
          Run the registry command below to add <code>{item.slug}</code> to your
          project.
        </p>
      ),
      content: (
        <InstallationCmd
          activePackageManager={activePackageManager}
          setActivePackageManager={setActivePackageManager}
          item={item}
        />
      ),
    },
    ...(dependencies?.length
      ? [
          {
            title: "Install manual dependencies",
            description: (
              <p>
                If you are wiring the component manually, install the package
                dependencies shown below.
              </p>
            ),
            content: (
              <ManualInstallationCmd
                activePackageManager={activePackageManager}
                setActivePackageManager={setActivePackageManager}
                dependencies={dependencies}
              />
            ),
          },
        ]
      : []),
    {
      title: "Import the component",
      description: (
        <p>
          Import <code>{item.name}</code> from your local UI registry output.
        </p>
      ),
      content: (
        <CodeBlock language="tsx" title="Import" showLineNumbers={false}>
          {importSnippet}
        </CodeBlock>
      ),
    },
  ];

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2
          id="installation"
          className="scroll-m-20 text-xl font-medium tracking-tight"
        >
          Installation
        </h2>
        <p className="text-muted-foreground text-sm leading-7">
          Install the registry item directly, then add any package dependencies
          if you are setting the component up manually.
        </p>
      </div>

      <DocsSteps>
        {steps.map((step, index) => (
          <DocsStep
            key={step.title}
            index={index + 1}
            title={step.title}
            description={step.description}
            isLast={index === steps.length - 1}
          >
            {step.content}
          </DocsStep>
        ))}
      </DocsSteps>
    </section>
  );
}
