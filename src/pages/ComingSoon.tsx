import { GlassCard } from "../uiPrimitives";

export default function ComingSoon() {
  return (
    <GlassCard className="p-10 text-center">
      <div className="text-xl font-bold text-ink">Coming soon</div>
      <div className="text-sm text-ink-soft mt-2">
        This screen isn't built yet.
      </div>
    </GlassCard>
  );
}
