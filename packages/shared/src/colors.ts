export const COLORS = {
  voidBlack: '#020408',
  spaceDark: '#0A0E1A',
  steelBlue: '#1A2332',
  fogGray: '#2A3444',
  textPrimary: '#E8ECF4',
  textSecondary: '#8899AA',
  textTertiary: '#556677',
  signalCyan: '#00E5FF',
  signalGreen: '#06D6A0',
  signalAmber: '#FFB300',
  signalRed: '#E63946',
  signalPurple: '#8B5CF6',
} as const;

export const DISTRICT_COLORS = {
  perception: { primary: '#7B61FF', secondary: '#00E5FF', accent: '#39FF14' },
  memory: { primary: '#D4A853', secondary: '#4A90D9', accent: '#F0F0FF' },
  reasoning: { primary: '#4B3F9E', secondary: '#C0C8D8', accent: '#FFD700' },
  action: { primary: '#E63946', secondary: '#FFB300', accent: '#06D6A0' },
  self_improvement: {
    primary: '#8B5CF6',
    secondary: '#00E5FF',
    accent: '#FFD700',
  },
} as const;
