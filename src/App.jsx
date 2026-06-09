import { useState } from 'react';
import ChatInput from './components/ChatInput.jsx';
import AnalyticsPanel from './components/AnalyticsPanel.jsx';
import { callFinanceAPI } from './services/api.js';
import { normalizeFinancePlan } from './utils/finance.js';
import './styles.css';

export default function App() {
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(userMessage) {
    setIsLoading(true);
    setError('');

    try {
      const apiPlan = await callFinanceAPI(userMessage);
      const safePlan = normalizeFinancePlan(apiPlan);
      setPlan(safePlan);
    } catch (err) {
      setError(err?.message || 'Не удалось рассчитать план. Попробуйте ещё раз.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleEdit() {
    setPlan(null);
    setError('');
  }

  return (
    <div className="app">
      <div className="app-bg app-bg-one" />
      <div className="app-bg app-bg-two" />

      {!plan ? (
        <ChatInput onSubmit={handleSubmit} isLoading={isLoading} error={error} />
      ) : (
        <AnalyticsPanel plan={plan} onEdit={handleEdit} />
      )}
    </div>
  );
}
