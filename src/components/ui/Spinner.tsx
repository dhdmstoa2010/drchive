import { SpinnerRing } from "./style/Spinner.style";

type SpinnerProps = {
  size?: number;
  className?: string;
};

export function Spinner({ size = 18, className = "" }: SpinnerProps) {
  return <SpinnerRing $size={size} className={className} />;
}
