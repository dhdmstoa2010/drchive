export const colors = {
  ink: "oklch(0.26 0.015 55)",
  inkSoft: "oklch(0.48 0.014 55)",
  inkFaint: "oklch(0.62 0.012 55)",
  lavender: "oklch(0.6 0.09 300)",
  lavenderDeep: "oklch(0.48 0.1 300)",
  lavenderBg: "oklch(0.6 0.09 300 / 0.14)",
  coral: "oklch(0.68 0.13 32)",
  coralDeep: "oklch(0.56 0.14 32)",
  glassBg: "rgba(255, 255, 255, 0.04)",
  glassBgSoft: "rgba(255, 255, 255, 0.03)",
  glassBorder: "rgba(255, 255, 255, 0.75)",
  tabActiveBg: "rgba(255, 255, 255, 0.32)",
};

export const shadows = {
  glass: `
    inset 0 2px 0 rgba(255, 255, 255, 1),
    inset 0 4px 14px rgba(255, 255, 255, 0.55),
    inset 2px 0 0 rgba(255, 255, 255, 0.55),
    inset -2px 0 10px rgba(110, 140, 255, 0.22),
    inset 0 -14px 26px rgba(255, 170, 190, 0.18),
    inset 0 -2px 0 rgba(255, 190, 140, 0.4),
    0 16px 40px rgba(70, 90, 160, 0.16),
    0 4px 10px rgba(70, 90, 160, 0.1)
  `,
  pillActive: "0 6px 16px rgba(140, 100, 190, 0.35)",
  pillIdle: "0 1px 3px rgba(0, 0, 0, 0.04)",
  tabActive: "inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 4px 12px rgba(20, 30, 45, 0.15)",
  sidebar: `
    inset 1px 0 0 rgba(255, 255, 255, 0.35),
    inset -6px 0 16px rgba(20, 40, 70, 0.12),
    10px 0 34px rgba(20, 30, 45, 0.18)
  `,
};

export const gradients = {
  page: `
    radial-gradient(circle at 12% 18%, #daeaf1 0%, transparent 45%),
    radial-gradient(circle at 85% 12%, #f9e8a2 0%, transparent 42%),
    radial-gradient(circle at 78% 82%, #ffe6e6 0%, transparent 48%),
    radial-gradient(circle at 25% 85%, #f9e8a2 0%, transparent 40%),
    radial-gradient(circle at 55% 50%, #ffffff 0%, transparent 60%)
  `,
  glass: `
    linear-gradient(
      115deg,
      rgba(255, 255, 255, 0.6) 0%,
      rgba(255, 255, 255, 0.05) 18%,
      rgba(255, 255, 255, 0.02) 32%,
      rgba(255, 255, 255, 0.04) 68%,
      rgba(200, 220, 255, 0.16) 88%,
      rgba(255, 255, 255, 0.4) 100%
    ),
    radial-gradient(65% 55% at 14% -10%, rgba(255, 255, 255, 0.75), transparent 55%),
    radial-gradient(60% 70% at 105% 120%, rgba(255, 190, 180, 0.22), transparent 55%),
    radial-gradient(40% 40% at 90% 5%, rgba(180, 210, 255, 0.3), transparent 60%)
  `,
  pillActive: `linear-gradient(135deg, ${colors.lavender}, ${colors.lavenderDeep})`,
  sidebar: `
    linear-gradient(
      165deg,
      rgba(150, 175, 200, 0.55) 0%,
      rgba(116, 141, 166, 0.68) 40%,
      rgba(116, 141, 166, 0.55) 100%
    ),
    radial-gradient(70% 40% at 20% 0%, rgba(255, 255, 255, 0.3), transparent 60%)
  `,
  avatar: `linear-gradient(135deg, ${colors.lavender}, ${colors.coral})`,
  place: [
    `repeating-linear-gradient(
      135deg,
      oklch(0.9 0.03 300) 0px,
      oklch(0.9 0.03 300) 14px,
      oklch(0.85 0.05 300) 14px,
      oklch(0.85 0.05 300) 28px
    )`,
    `repeating-linear-gradient(
      135deg,
      oklch(0.9 0.03 32) 0px,
      oklch(0.9 0.03 32) 14px,
      oklch(0.85 0.06 32) 14px,
      oklch(0.85 0.06 32) 28px
    )`,
    `repeating-linear-gradient(
      135deg,
      oklch(0.9 0.02 200) 0px,
      oklch(0.9 0.02 200) 14px,
      oklch(0.85 0.04 200) 14px,
      oklch(0.85 0.04 200) 28px
    )`,
    `repeating-linear-gradient(
      135deg,
      oklch(0.9 0.02 140) 0px,
      oklch(0.9 0.02 140) 14px,
      oklch(0.85 0.04 140) 14px,
      oklch(0.85 0.04 140) 28px
    )`,
  ],
};

export const theme = { colors, shadows, gradients };

export type Theme = typeof theme;
