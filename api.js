import { formatCurrency, formatPercent } from '../utils/finance.js';

export default function SavingsCalendar({ months }) {
  if (!months.length) {
    return (
      <div className="empty-state">
        <h3>Календарь пока не построен</h3>
        <p>Свободный остаток на цель должен быть больше нуля.</p>
      </div>
    );
  }

  return (
    <div className="calendar-list">
      {months.map((month, index) => (
        <article className="month-card" key={month.id}>
          <div className="month-head">
            <div>
              <span>Месяц {index + 1}</span>
              <h3>{month.month}</h3>
            </div>
            <strong>{formatPercent(month.progress)}</strong>
          </div>

          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${month.progress}%` }} />
          </div>

          <div className="month-values">
            <div>
              <span>Откладывать</span>
              <strong>{formatCurrency(month.saving)}</strong>
            </div>
            <div>
              <span>Итого накоплено</span>
              <strong>{formatCurrency(month.accumulated)}</strong>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
