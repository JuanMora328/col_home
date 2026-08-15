"use client";

import type { ReactNode } from "react";

export function AdminAction({ children, confirmMessage, className }: { children: ReactNode; confirmMessage: string; className: string }) {
  return <button className={className} type="submit" onClick={(event) => { if (!window.confirm(confirmMessage)) event.preventDefault(); }}>{children}</button>;
}
