/**
 * ProfitPros Branding Configuration
 */
export const PROFITPROS_BRAND = {
    colors: {
        primary: '#00A8E8', // Bull blue
        secondary: '#00D9A3', // Bear teal/green
        accent: '#1A4B84', // Dark blue
        success: '#00D9A3',
        warning: '#FFA500',
        danger: '#FF4444',
        // Gradients
        bullGradient: 'linear-gradient(135deg, #00A8E8 0%, #0084C7 100%)',
        bearGradient: 'linear-gradient(135deg, #00D9A3 0%, #00B894 100%)',
        balancedGradient: 'linear-gradient(90deg, #00A8E8 0%, #00D9A3 100%)'
    },
    messages: {
        welcome: "Welcome to ProfitPath by ProfitPros - Your Journey to Consistent Trading",
        tagline: "Good Habits. Strong Psychology. Sustainable Profits.",
        // Risk levels
        conservative: {
            label: "Conservative Trader",
            message: "Building consistency through disciplined risk management",
            icon: "🐻",
            color: "#00D9A3"
        },
        balanced: {
            label: "Balanced Trader",
            message: "Optimizing growth with calculated risks",
            icon: "⚖️",
            color: "#00A8E8"
        },
        aggressive: {
            label: "Aggressive Trader",
            message: "High risk requires exceptional discipline",
            icon: "🐂",
            color: "#0084C7"
        }
    },
    // Educational tips based on inputs
    tips: {
        lowWinRate: "Pro tip: Focus on improving your R:R ratio. Even 35% win rate is profitable with 2:1 R:R!",
        highRisk: "Warning: Risk above 3% per trade significantly increases emotional trading",
        goodExpectancy: "Excellent! Your positive expectancy shows professional-level trading",
        breakeven: "Using breakeven stops? Smart move - this is how pros protect profits",
        multipleAccounts: "Copy trading tip: Start with 2-3 accounts max until you prove consistency"
    },
    // Psychology checklist
    preTradeChecklist: [
        { id: 'rested', label: 'I am well-rested and alert', required: true },
        { id: 'plan', label: 'I have a clear trading plan for today', required: true },
        { id: 'risk', label: 'I am only risking money I can afford to lose', required: true },
        { id: 'emotions', label: 'I am emotionally balanced and focused', required: true },
        { id: 'rules', label: 'I will follow my rules regardless of outcome', required: true }
    ],
    // Community CTAs
    discord: {
        invite: 'https://discord.gg/profitpros',
        memberCount: '5,000+',
        benefits: [
            'Live trading rooms',
            'Daily market analysis',
            'Personal mentorship',
            '24/7 community support'
        ]
    },
    // Success metrics
    stats: {
        totalMembers: '5,000+',
        avgWinRateImprovement: '15%',
        profitableMembers: '73%',
        avgTimeToConsistency: '90 days'
    }
};
// Risk profile calculator
export function getRiskProfile(riskPercent) {
    if (riskPercent <= 2)
        return 'conservative';
    if (riskPercent <= 3)
        return 'balanced';
    return 'aggressive';
}
// Trading psychology score
export function calculatePsychologyScore(params) {
    const weights = {
        winRate: 0.2,
        riskReward: 0.3,
        consistency: 0.3,
        discipline: 0.2
    };
    return (params.winRate * weights.winRate +
        params.riskReward * weights.riskReward +
        params.consistency * weights.consistency +
        params.discipline * weights.discipline);
}
export function updateStreak(currentStreak, todayPerformance) {
    const allGood = Object.values(todayPerformance).every(v => v);
    if (allGood) {
        const newStreak = currentStreak.currentStreak + 1;
        return {
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, currentStreak.longestStreak),
            lastGoodDay: new Date(),
            habits: todayPerformance
        };
    }
    return {
        ...currentStreak,
        currentStreak: 0,
        habits: todayPerformance
    };
}
