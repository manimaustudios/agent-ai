"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const SidebarContext = createContext<{
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  closeSidebarOnMobile: () => void;
}>({
  isSidebarOpen: false,
  setIsSidebarOpen: () => {},
  closeSidebarOnMobile: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // useEffect(() => {
  //   const checkWindowSize = () => {
  //     if (window.innerWidth > 768) {
  //       setIsSidebarOpen(true);
  //     } else {
  //       setIsSidebarOpen(false);
  //     }
  //   };

  //   checkWindowSize();

  //   window.addEventListener('resize', checkWindowSize);

  //   return () => {
  //     window.removeEventListener('resize', checkWindowSize);
  //   };
  // }, []);

  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <SidebarContext.Provider
      value={{ isSidebarOpen, setIsSidebarOpen, closeSidebarOnMobile }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
