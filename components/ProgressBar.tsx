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
    const timer = setTimeout(() => setProgress((amount / limit) * 100), 500);
    return () => clearTimeout(timer);
  }, [amount, limit]);

  return (
    <div>
      <Progress value={progress} className="h-2 w-[80%]" />
      <div className="mt-1 text-sm font-medium">
        <p>
          Used: {amount} / {limit}
        </p>
      </div>
    </div>
  );
}

export default ProgressBar;
