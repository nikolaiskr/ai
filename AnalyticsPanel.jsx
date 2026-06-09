import { formatCurrency } from '../utils/finance.js';

export default function DonutChart({ plan }) {
  const income = Math.max(plan.monthly_income, 1);
  const mandatory = Math.max(plan.mandatory_expenses, 0);
  const safety = Math.max(plan.safety_net, 0);
  const savings = Math.max(plan.free_for_savings, 0);
  const other = Math.max(income - mandatory - safety - savings, 0);

  const segments = [
    { label: 'Обязательные платежи', value: mandatory, className: 'segment-expenses' },
    { label: 'Защитный слой', value: safety, className: 'segment-safety' },
    { label: 'Накопления', value: savings, className: 'segment-savings' },
    { label: 'Нераспределено', value: other, className: 'segment-other' }
  ].filter((segment) => segment.value > 0);

  let offset = 0;
  const circumference = 100;

  return (
    <div className="chart-card">
      <div className="donut-wrap" aria-label="Диаграмма распределения дохода">
        <svg viewBox="0 0 42 42" className="donut">
          <circle className="donut-bg" cx="21" cy="21" r="15.915" />
          {segments.map((segment) => {
            const dash = (segment.value / income) * circumference;
            const currentOffset = offset;
            offset += dash;

            return (
              <circle
                key={segment.label}
                className={`donut-segment ${segment.className}`}
                cx="21"
                cy="21"
                r="15.915"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-currentOffset}
              />
            );
          })}
        </svg>
        <div className="donut-center">
          <span>Доход</span>
          <strong>{formatCurrency(plan.monthly_income)}</strong>
        </div>
      </div>

      <div className="legend">
        {segments.map((segment) => (
          <div className="legend-row" key={segment.label}>
            <span className={`legend-dot ${segment.className}`} />
            <span>{segment.label}</span>
            <strong>{formatCurrency(segment.value)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
