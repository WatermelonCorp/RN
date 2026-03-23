"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import type { TOCItemType } from "fumadocs-core/toc";

type TOCContextType = {
  items: TOCItemType[];
  setItems: (items: TOCItemType[]) => void;
};

const TOCContext = createContext<TOCContextType | undefined>(undefined);

export function TOCProvider({ children }: { children: React.ReactNode }) {
  const [items, setItemsState] = useState<TOCItemType[]>([]);

  const setItems = useCallback((newItems: TOCItemType[]) => {
    setItemsState(newItems);
  }, []);

  return (
    <TOCContext.Provider value={{ items, setItems }}>
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
