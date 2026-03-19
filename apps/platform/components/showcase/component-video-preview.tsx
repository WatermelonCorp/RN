"use client";

import { CardCard } from "@/components/showcase/video-card";

interface ComponentVideoPreviewProps {
  name: string;
  description: string;
  category: string;
  video?: string;
  image?: string;
}

const NOOP_PRELOAD = () => Promise.resolve();
const NOOP_CLICK = () => {};

export function ComponentVideoPreview({
  name,
  description,
  category,
  video = "",
  image = "",
}: ComponentVideoPreviewProps) {
  return (
    <CardCard
      item={{
        name,
        description,
        category,
        video,
        image,
        comingSoon: false,
        install: [],
        slug: "",
        preload: NOOP_PRELOAD,
      }}
      onClick={NOOP_CLICK}
    />
  );
}
