"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaRegMessage } from "react-icons/fa6";

import { Button } from "./ui/button";
import LoadingSpinner from "./LoadingSpinner";

function CallToAcrionButton() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <Button asChild className="px-6 py-6" onClick={() => setIsLoading(true)}>
      <Link href="/agent" className="just flex items-center gap-3 text-base">
        Start Chatting
        {isLoading ? (
          <LoadingSpinner className="h-4 w-4 text-white" />
        ) : (
          <FaRegMessage className="h-4 w-4 text-white" />
        )}
      </Link>
    </Button>
  );
}

export default CallToAcrionButton;
