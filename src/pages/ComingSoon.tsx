import { GlassCard } from "../components/ui/GlassCard";

type ComingSoonProps = {
  title: string;
  description: string;
};

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="flex flex-col gap-7">
      <div>
        <div className="text-[38px] font-extrabold text-[#0d0d0d] tracking-[-0.6px] break-keep">
          {title}
        </div>
        <div className="text-base text-ink-soft font-normal mt-2 break-keep whitespace-normal max-w-[520px]">
          {description}
        </div>
      </div>

      <GlassCard
        interactive={false}
        className="flex items-center justify-center h-[300px] text-ink-soft font-semibold"
      >
        준비 중이에요. 곧 만나볼 수 있어요!
      </GlassCard>
    </div>
  );
}
