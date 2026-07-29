"use client";

import { DesignSystemPage } from "@/components/design-system-page";
import { PageSwitcher, type RelayPage } from "@/components/page-switcher";
import { RelayChatApp } from "@/components/relay-chat-app";
import { useState } from "react";

export function RelayAppShell() {
  const [page, setPage] = useState<RelayPage>("system");

  return (
    <>
      {page === "system" ? <DesignSystemPage /> : <RelayChatApp />}
      <PageSwitcher active={page} onChange={setPage} />
    </>
  );
}
