import styled from 'styled-components'
import { GLASS_BG, GLASS_BG_SOFT, GLASS_BORDER, GLASS_SHADOW, INK_SOFT, LAVENDER, LAVENDER_DEEP } from './theme'

export const GlassCard = styled.div`
  position: relative;
  background:
    linear-gradient(115deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.05) 18%, rgba(255,255,255,0.02) 32%, rgba(255,255,255,0.04) 68%, rgba(200,220,255,0.16) 88%, rgba(255,255,255,0.4) 100%),
    radial-gradient(65% 55% at 14% -10%, rgba(255,255,255,0.75), transparent 55%),
    radial-gradient(60% 70% at 105% 120%, rgba(255,190,180,0.22), transparent 55%),
    radial-gradient(40% 40% at 90% 5%, rgba(180,210,255,0.3), transparent 60%),
    ${GLASS_BG};
  backdrop-filter: blur(11px) saturate(240%);
  -webkit-backdrop-filter: blur(11px) saturate(240%);
  border: ${GLASS_BORDER};
  border-radius: 28px;
  box-shadow: ${GLASS_SHADOW};
`

export const PillButton = styled.button<{ $active?: boolean }>`
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  padding: 9px 18px;
  border-radius: 999px;
  border: ${(p) => (p.$active ? '1px solid rgba(255,255,255,0.5)' : GLASS_BORDER)};
  background: ${(p) => (p.$active ? `linear-gradient(135deg, ${LAVENDER}, ${LAVENDER_DEEP})` : GLASS_BG_SOFT)};
  color: ${(p) => (p.$active ? '#fff' : INK_SOFT)};
  backdrop-filter: blur(14px) saturate(180%);
  -webkit-backdrop-filter: blur(14px) saturate(180%);
  box-shadow: ${(p) => (p.$active ? '0 6px 16px rgba(140,100,190,0.35)' : '0 1px 3px rgba(0,0,0,0.04)')};
  cursor: pointer;
  transition: transform 0.15s ease;
  white-space: nowrap;
`
