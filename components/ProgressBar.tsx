import { useEffect, useState } from "react";
import { Progress } from "./ui/progress";

type Props = {};

function ProgressBar({}: Props) {
  const [progress, setProgress] = useState(13);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return <Progress value={progress} className="w-[60%]" />;
}

export default ProgressBar;
