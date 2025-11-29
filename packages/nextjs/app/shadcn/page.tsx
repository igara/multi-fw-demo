"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@multi-fw-demo-igarashi/shadcn";
import { useState } from "react";
import "./globals.css";

export default function Shadcn() {
  const [open, setOpen] = useState(false);

  return (
    <main className="p-8">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>ダイアログを開く</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ダイアログのタイトル</DialogTitle>
            <DialogDescription>
              こちらはダイアログの説明文です。ここに詳細な情報を記載できます。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>ダイアログの本文コンテンツがここに入ります。</p>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
