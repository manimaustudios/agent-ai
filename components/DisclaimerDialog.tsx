"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

function DisclaimerDialog() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <DialogContent>
        <DialogHeader className="space-y-6">
          <DialogTitle>Disclaimer Message</DialogTitle>
          <DialogDescription>Disclaimer message goes here.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default DisclaimerDialog;
