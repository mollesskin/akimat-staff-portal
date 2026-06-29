"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

export function ConfirmDialog({ open, title = "Подтвердите действие", description, onConfirm, onCancel }) {
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => !value && onCancel()}
      title={title}
      className="max-w-md"
      footer={
        <>
          <Button variant="outline" onClick={onCancel}>Отмена</Button>
          <Button variant="destructive" onClick={onConfirm}>Удалить</Button>
        </>
      }
    >
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Dialog>
  );
}
