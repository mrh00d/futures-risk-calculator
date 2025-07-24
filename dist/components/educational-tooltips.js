/**
 * Educational Tooltips for ProfitPros Integration
 */
export const EDUCATIONAL_TOOLTIPS = {
    winRate: {
        id: 'winRate',
        title: 'Win Rate Reality Check',
        content: 'ProfitPros Truth: You don\'t need a high win rate to be profitable! With proper R:R, even 35-40% wins can generate consistent profits. Focus on risk management, not being right.',
        type: 'psychology',
        link: {
            text: 'Learn our Win Rate strategies',
            url: 'https://discord.gg/profitpros'
        }
    },
    riskReward: {
        id: 'riskReward',
        title: 'Risk:Reward Mastery',
        content: 'The golden rule: Never take trades below 1.5:1 R:R. ProfitPros members average 2.3:1 by being selective. Higher R:R = lower stress trading.',
        type: 'info',
        link: {
            text: 'See R:R setups in Discord',
            url: 'https://discord.gg/profitpros'
        }
    },
    expectancy: {
        id: 'expectancy',
        title: 'The Most Important Metric',
        content: 'Expectancy tells you how much you\'ll make per trade on average. Positive expectancy = profitable system. This is what separates pros from gamblers.',
        type: 'success'
    },
    stopLoss: {
        id: 'stopLoss',
        title: 'Stop Loss Discipline',
        content: 'Your stop loss is your best friend. ProfitPros rule: Define your risk BEFORE entering. Moving stops away from price = amateur behavior.',
        type: 'warning'
    },
    profitTarget: {
        id: 'profitTarget',
        title: 'Target Setting Psychology',
        content: 'Set realistic targets based on market structure, not hopes. Pros take partial profits - it\'s better to book gains than watch winners become losers.',
        type: 'info'
    },
    breakeven: {
        id: 'breakeven',
        title: 'The Breakeven Debate',
        content: 'Moving to breakeven reduces risk but can limit profits. ProfitPros strategy: Only move to BE after 1.5R profit to maintain positive expectancy.',
        type: 'psychology'
    },
    multipleAccounts: {
        id: 'multipleAccounts',
        title: 'Copy Trading Wisdom',
        content: 'Start with 1-2 accounts max. Prove consistency first! Scaling too fast amplifies mistakes. Our top traders waited 6+ months before adding accounts.',
        type: 'warning'
    },
    commission: {
        id: 'commission',
        title: 'The Hidden Profit Killer',
        content: 'Commissions add up fast! Include them in EVERY calculation. Pro tip: Negotiate better rates once you hit $1M+ volume.',
        type: 'info'
    },
    propFirm: {
        id: 'propFirm',
        title: 'Prop Firm Success Path',
        content: '73% of ProfitPros members pass evaluations because we focus on consistency over home runs. Treat eval like real money = higher success rate.',
        type: 'success',
        link: {
            text: 'Get our Prop Firm playbook',
            url: 'https://discord.gg/profitpros'
        }
    },
    dailyPL: {
        id: 'dailyPL',
        title: 'Daily P&L Psychology',
        content: 'Don\'t obsess over daily results. Focus on weekly/monthly trends. Red days are normal - it\'s how you respond that matters.',
        type: 'psychology'
    },
    // Risk warnings
    highRisk: {
        id: 'highRisk',
        title: '⚠️ High Risk Alert',
        content: 'You\'re risking over 3% per trade. This dramatically increases emotional decisions and account blow-up risk. Scale back to 1-2% immediately.',
        type: 'warning'
    },
    lowExpectancy: {
        id: 'lowExpectancy',
        title: '⚠️ Negative Expectancy',
        content: 'Your current settings show negative expectancy. This means you\'ll lose money long-term. Improve your R:R or win rate before trading live.',
        type: 'warning'
    },
    overtrading: {
        id: 'overtrading',
        title: 'Overtrading Warning',
        content: 'More than 5 trades per day often indicates revenge trading or FOMO. Quality > Quantity. Our best traders average 2-3 high-probability setups daily.',
        type: 'warning'
    }
};
// Tooltip HTML template
export function createTooltipHTML(tooltip) {
    const colors = {
        info: 'bg-blue-100 text-blue-800 border-blue-200',
        warning: 'bg-red-100 text-red-800 border-red-200',
        success: 'bg-green-100 text-green-800 border-green-200',
        psychology: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return `
    <div class="absolute z-50 p-3 rounded-lg shadow-lg border ${colors[tooltip.type]} max-w-xs">
      <div class="font-bold mb-1">${tooltip.title}</div>
      <div class="text-sm mb-2">${tooltip.content}</div>
      ${tooltip.link ? `
        <a href="${tooltip.link.url}" target="_blank" 
           class="text-xs underline hover:no-underline">
          ${tooltip.link.text} →
        </a>
      ` : ''}
      <div class="absolute -top-2 left-4 w-4 h-4 ${colors[tooltip.type]} border-l border-t transform rotate-45"></div>
    </div>
  `;
}
// Psychology scoring based on inputs
export function calculatePsychologyMetrics(data) {
    const warnings = [];
    // Discipline Score (based on risk management)
    const riskPerTrade = (data.avgLossAmount / data.accountBalance) * 100;
    let disciplineScore = 100;
    if (riskPerTrade > 5) {
        disciplineScore = 20;
        warnings.push('Extremely high risk per trade');
    }
    else if (riskPerTrade > 3) {
        disciplineScore = 60;
        warnings.push('Risk per trade is above recommended levels');
    }
    else if (riskPerTrade > 2) {
        disciplineScore = 80;
    }
    // Focus Score (based on trade quality)
    let focusScore = 100;
    if (data.totalTrades > 10) {
        focusScore = 40;
        warnings.push('High trade count may indicate overtrading');
    }
    else if (data.totalTrades > 5) {
        focusScore = 70;
    }
    else if (data.totalTrades <= 3) {
        focusScore = 100;
    }
    // Confidence Score (based on R:R and win rate balance)
    let confidenceScore = 50;
    if (data.riskReward >= 2 && data.winRate >= 0.4) {
        confidenceScore = 90;
    }
    else if (data.riskReward >= 1.5 && data.winRate >= 0.35) {
        confidenceScore = 75;
    }
    else if (data.riskReward < 1) {
        confidenceScore = 20;
        warnings.push('Poor risk:reward ratio undermines confidence');
    }
    const overallScore = (disciplineScore + focusScore + confidenceScore) / 3;
    return {
        disciplineScore,
        focusScore,
        confidenceScore,
        overallScore: Math.round(overallScore),
        warnings
    };
}
