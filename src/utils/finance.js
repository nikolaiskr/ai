export function formatCurrency(value) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export function formatPercent(value) {
  return `${Math.round(Number(value || 0))}%`;
}

export function formatDateRu(dateString) {
  if (!dateString) return 'Не рассчитано';

  return new Intl.DateTimeFormat('ru-RU', {
    month: 'long',
    year: 'numeric'
  }).format(new Date(dateString));
}

export function normalizeFinancePlan(apiPlan) {
  const monthlyIncome = Number(apiPlan.monthly_income || 0);
  const mandatoryExpenses = Number(apiPlan.mandatory_expenses || 0);
  const originalSafetyNet = Number(apiPlan.safety_net || 0);
  const minimumSafetyNet = Math.ceil(monthlyIncome * 0.1);
  const correctedSafetyNet = Math.max(originalSafetyNet, minimumSafetyNet);
  const freeForSavings = monthlyIncome - mandatoryExpenses - correctedSafetyNet;
  const goalAmount = Number(apiPlan.goal_amount || 0);
  const monthsNeeded = freeForSavings > 0 && goalAmount > 0 ? Math.ceil(goalAmount / freeForSavings) : 0;
  const completionDate = monthsNeeded > 0 ? getCompletionDate(monthsNeeded) : null;

  const warnings = [];

  if (originalSafetyNet < minimumSafetyNet) {
    warnings.push(
      `Защитный слой был увеличен до 10% от дохода: ${formatCurrency(correctedSafetyNet)}.`
    );
  }

  if (freeForSavings < 0) {
    warnings.push(
      'Свободный остаток на цель отрицательный. Нужно увеличить доход, сократить платежи или пересобрать цель.'
    );
  } else if (freeForSavings < monthlyIncome * 0.05) {
    warnings.push(
      'Свободный остаток на цель меньше 5% дохода. Лучше увеличить срок накопления или сократить обязательные траты.'
    );
  }

  return {
    ...apiPlan,
    goal_amount: goalAmount,
    monthly_income: monthlyIncome,
    mandatory_expenses: mandatoryExpenses,
    safety_net: correctedSafetyNet,
    original_safety_net: originalSafetyNet,
    free_for_savings: freeForSavings,
    months_needed: monthsNeeded,
    completion_date: completionDate,
    warnings
  };
}

export function generateSavingsCalendar(plan) {
  const months = [];
  const goalAmount = Number(plan.goal_amount || 0);
  const monthlySaving = Math.max(Number(plan.free_for_savings || 0), 0);

  if (!goalAmount || !monthlySaving) return months;

  let accumulated = 0;
  const date = new Date();
  date.setDate(1);

  while (accumulated < goalAmount && months.length < 600) {
    accumulated = Math.min(accumulated + monthlySaving, goalAmount);
    const progress = Math.min((accumulated / goalAmount) * 100, 100);

    months.push({
      id: `${date.getFullYear()}-${date.getMonth()}`,
      month: new Intl.DateTimeFormat('ru-RU', {
        month: 'long',
        year: 'numeric'
      }).format(date),
      saving: monthlySaving,
      accumulated,
      progress
    });

    date.setMonth(date.getMonth() + 1);
  }

  return months;
}

function getCompletionDate(monthsNeeded) {
  const date = new Date();
  date.setDate(1);
  date.setMonth(date.getMonth() + Math.max(monthsNeeded - 1, 0));
  return date.toISOString().slice(0, 10);
}
