"use client";

import { useId, useRef } from "react";
import { useFormStatus } from "react-dom";

type ConfirmActionProps = {
  action: string;
  triggerLabel: string;
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
};

export function ConfirmAction({
  action,
  triggerLabel,
  title,
  description,
  confirmLabel,
  destructive = false,
}: ConfirmActionProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  return (
    <>
      <button
        className={destructive ? "button-danger" : "button-primary"}
        type="button"
        onClick={() => dialogRef.current?.showModal()}
      >
        {triggerLabel}
      </button>
      <dialog
        ref={dialogRef}
        className="modal"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <h2 className="font-heading text-2xl font-semibold" id={titleId}>
          {title}
        </h2>
        <p className="mt-4 text-ink-muted">{description}</p>
        <form
          action={action}
          method="post"
          className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end"
        >
          <button
            className="button-secondary"
            type="button"
            autoFocus
            onClick={() => dialogRef.current?.close()}
          >
            Cancelar
          </button>
          <SubmitButton>{confirmLabel}</SubmitButton>
        </form>
      </dialog>
    </>
  );
}

function SubmitButton({ children }: { children: string }) {
  const { pending } = useFormStatus();
  return (
    <button className="button-primary" type="submit" disabled={pending}>
      {pending ? "Procesando…" : children}
    </button>
  );
}
