import DonutChart from './DonutChart.jsx';
import SummaryCards from './SummaryCards.jsx';
import SavingsCalendar from './SavingsCalendar.jsx';
import { generateSavingsCalendar, formatCurrency } from '../utils/finance.js';

export default function AnalyticsPanel({ plan, onEdit }) {
  const months = generateSavingsCalendar(plan);
  const isNegative = plan.free_for_savings < 0;
  const isTooLow = plan.free_for_savings >= 0 && plan.free_for_savings < plan.monthly_income * 0.05;

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">План накоплений</p>
          <h1>Цель: {plan.goal}</h1>
          <p>
            Нужно накопить <strong>{formatCurrency(plan.goal_amount)}</strong>. При текущем плане срок —{' '}
            <strong>{plan.months_needed > 0 ? `${plan.months_needed} месяцев` : 'не рассчитан'}</strong>.
          </p>
        </div>
        <button className="secondary-button" onClick={onEdit}>Редактировать ввод</button>
      </header>

      {!!plan.warnings?.length && (
        <section className="warnings-stack">
          {plan.warnings.map((warning) => (
            <div className="warning-box" key={warning}>{warning}</div>
          ))}
        </section>
      )}

      {isNegative && (
        <section className="danger-box">
          <h2>План финансово небезопасен</h2>
          <p>
            После обязательных расходов и защитного слоя остаётся отрицательная сумма. Накопления начнутся только после изменения параметров.
          </p>
        </section>
      )}

      {isTooLow && (
        <section className="warning-box">
          Свободный остаток меньше 5% дохода. Стоит увеличить срок цели или сократить обязательные траты.
        </section>
      )}

      <section className="dashboard-grid">
        <div className="panel analytics-section">
          <div className="section-title">
            <p className="eyebrow">Блок А</p>
            <h2>Календарь накоплений</h2>
          </div>
          <SavingsCalendar months={months} />
        </div>

        <aside className="side-column">
          <div className="panel analytics-section">
            <div className="section-title">
              <p className="eyebrow">Блок Б</p>
              <h2>Полная аналитика</h2>
            </div>
            <DonutChart plan={plan} />
          </div>

          <div className="panel analytics-section">
            <h2>Ключевые числа</h2>
            <SummaryCards plan={plan} />
          </div>

          <div className="panel analytics-section">
            <h2>Рекомендации ИИ</h2>
            <ul className="recommendations">
              {plan.recommendations?.map((recommendation) => (
                <li key={recommendation}>{recommendation}</li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
