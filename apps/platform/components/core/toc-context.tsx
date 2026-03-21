"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type TocItem = {
  id: string;
  title: string;
  depth?: number;
};

type TOCContextType = {
  items: TocItem[];
  setItems: (items: TocItem[]) => void;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
};

const TOCContext = createContext<TOCContextType | undefined>(undefined);

export function TOCProvider({ children }: { children: React.ReactNode }) {
  const [items, setItemsState] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const setItems = useCallback((newItems: TocItem[]) => {
    setItemsState(newItems);
  }, []);

  return (
    <TOCContext.Provider value={{ items, setItems, activeId, setActiveId }}>
      {children}
    </TOCContext.Provider>
  );
}

export function useTOC() {
  const context = useContext(TOCContext);
  if (!context) {
    throw new Error("useTOC must be used within a TOCProvider");
  }
  return context;
}
