"use client";

import { useEffect, useState } from "react";

import { Progress } from "./ui/progress";

type ProgressBarProps = {
  amount: number;
  limit: number;
};

function ProgressBar({ amount, limit }: ProgressBarProps) {
  const [progress, setProgress] = useState(limit);

  useEffect(() => {
    const timer = setTimeout(
      () => setProgress(limit > 0 ? Math.min(100, (amount / limit) * 100) : 0),
      500,
    );
    return () => clearTimeout(timer);
  }, [amount, limit]);

  return (
    <div>
      <Progress value={progress} className="h-2 w-[80%]" />
      <div className="mt-1 text-sm font-medium">
        <p>Free messages: {Math.max(0, limit - amount)} remaining</p>
      </div>
    </div>
  );
}

export default ProgressBar;
