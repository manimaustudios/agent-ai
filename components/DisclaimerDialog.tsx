"use client";

import Link from "next/link";
import { useState } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

function DisclaimerDialog() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-h-[90vh]">
        <DialogHeader className="space-y-6">
          <DialogTitle className="text-center">
            Important - Please Read:
          </DialogTitle>
          <DialogDescription className="max-h-[50vh] text-left">
            <ScrollArea className="h-full overflow-y-auto rounded-md px-2">
              <p className="pb-3 text-sm">
                This service is not a substitute for professional crisis
                intervention. If you are in crisis, experiencing thoughts of
                self-harm or harm to others, please call 911 or go to the
                nearest emergency room immediately. This service does not
                provide emergency support.
              </p>

              <h4 className="font-medium text-white">Privacy:</h4>
              <p className="pb-3 text-sm">
                Your chats are stored locally in your browser and are not
                permanently saved on our servers. Messages are briefly processed
                on our servers for abuse prevention but are not retained.
              </p>

              <h4 className="font-medium text-white">Service Use:</h4>
              <p className="pb-3 text-sm">
                By using this service, you acknowledge that it is not a
                replacement for therapy, counseling, or professional mental
                health care. Your use of this service is governed by our{" "}
                <Link href="/terms-of-service" className="text-blue-600">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="text-blue-600">
                  Privacy Policy
                </Link>
                .
              </p>

              <h4 className="font-medium text-white">Liability:</h4>
              <p className="pb-3 text-sm">
                We disclaim any liability for outcomes resulting from the use of
                this service. Always consult a qualified health professional for
                any concerns about your mental health.
              </p>
            </ScrollArea>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="mx-auto px-2 text-left">
            <Button onClick={() => setIsOpen(false)}>I Agree</Button>
            <p className="pt-2 text-xs text-slate-400">
              Free AI Therapist is not a licensed therapist, LMHC, LMFT, or
              psychiatrist. For professional support, please consult a qualified
              human therapist or mental health professional. By using this
              service, you acknowledge and understand these terms
            </p>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DisclaimerDialog;
