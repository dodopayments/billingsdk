"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useSidebar } from "fumadocs-ui/components/sidebar/base";

const STORAGE_KEY = "billingsdk-docs-sidebar-collapsed";

export function SidebarPersistence() {
  const { collapsed, setCollapsed } = useSidebar();
  const [restored, setRestored] = useState(false);

  useLayoutEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "true");
      setRestored(true);
    } catch {
      // Storage can be unavailable in privacy-restricted browser contexts.
    }
  }, [setCollapsed]);

  useEffect(() => {
    if (restored) {
      try {
        window.localStorage.setItem(STORAGE_KEY, String(collapsed));
      } catch {
        // The sidebar still works when storage is unavailable.
      }
    }
  }, [collapsed, restored]);

  return null;
}
