import { formatCurrency, formatDateRu } from '../utils/finance.js';

export default function SummaryCards({ plan }) {
  const cards = [
    {
      title: 'Доход',
      value: formatCurrency(plan.monthly_income),
      note: 'ежемесячно'
    },
    {
      title: 'Обязательные платежи',
      value: formatCurrency(plan.mandatory_expenses),
      note: 'кредиты, ЖКХ, связь, подписки'
    },
    {
      title: 'Защитный слой',
      value: formatCurrency(plan.safety_net),
      note: 'лечение, форс-мажоры, покупки'
    },
    {
      title: 'На цель',
      value: formatCurrency(plan.free_for_savings),
      note: 'безопасный остаток'
    },
    {
      title: 'Срок',
      value: plan.months_needed > 0 ? `${plan.months_needed} мес.` : 'не рассчитан',
      note: formatDateRu(plan.completion_date)
    },
    {
      title: 'Цель',
      value: formatCurrency(plan.goal_amount),
      note: plan.goal
    }
  ];

  return (
    <div className="cards-grid">
      {cards.map((card) => (
        <article className="metric-card" key={card.title}>
          <span>{card.title}</span>
          <strong>{card.value}</strong>
          <small>{card.note}</small>
        </article>
      ))}
    </div>
  );
}
