import { cn } from "@/lib/utils";
import React from "react";

const Title = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h1 className={cn("text-xl font-medium sm:text-2xl", className)}>
      {children}
    </h1>
  );
};

const SubTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <p className={cn("max-w-3xl text-base", className)}>{children}</p>;
};

const PageHeader = ({
  className,
  badge,
  title,
  subTitle,
}: {
  className?: string;
  badge?: string;
  title: string;
  subTitle: string;
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-muted-foreground text-xs font-medium tracking-[0.22em] uppercase">
        {badge}
      </p>
      <Title>{title}</Title>
      <SubTitle>{subTitle}</SubTitle>
    </div>
  );
};

export { Title, SubTitle, PageHeader };
