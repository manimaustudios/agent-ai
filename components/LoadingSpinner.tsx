import { cn } from "@/lib/utils";
import { ImSpinner2 } from "react-icons/im";

type LoadingSpinnerProps = {
  className?: string;
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className }) => {
  return (
    <ImSpinner2
      className={cn("animate-spin-slow h-5 w-5 text-primary", className)}
    />
  );
};

export default LoadingSpinner;
