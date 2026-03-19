import { Loader2 } from "lucide-react";

export const DEFAULT_SPINNER_CLOSE_DELAY_MS = 300;

interface SpinnerProps {
  className?: string;
  fullscreen?: boolean;
}

const Spinner = ({
  className = "h-4 w-4",
  fullscreen = false,
}: SpinnerProps) => {
  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/45 backdrop-blur-md">
        <Loader2 className={`${className} animate-spin`} />
      </div>
    );
  }

  return <Loader2 className={`${className} animate-spin`} />;
};

export default Spinner;
