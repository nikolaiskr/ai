import { useState } from 'react';

const EXAMPLE_MESSAGE =
  'Хочу накопить на машину 1.2 млн. Получаю 85 тыс, обязательные платежи 35 тыс, на лечение и форс-мажоры — 10 тыс.';

export default function ChatInput({ onSubmit, isLoading, error }) {
  const [message, setMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    if (!message.trim() || isLoading) return;
    onSubmit(message.trim());
  }

  function useExample() {
    setMessage(EXAMPLE_MESSAGE);
  }

  return (
    <section className="chat-shell">
      <div className="chat-card">
        <div className="bot-message">
          <div className="avatar">ИИ</div>
          <div className="message-bubble">
            <p className="eyebrow">Финансовый ИИ-навигатор</p>
            <h1>Опиши финансовую ситуацию свободным текстом</h1>
            <p>
              Я рассчитаю срок накопления, соберу календарь по месяцам и покажу, сколько можно безопасно откладывать.
            </p>
            <ul>
              <li>На что копишь?</li>
              <li>Какая сумма цели?</li>
              <li>Какой доход в месяц?</li>
              <li>Сколько уходят обязательные платежи?</li>
              <li>Сколько оставить на лечение, форс-мажоры, подарки, одежду и развлечения?</li>
            </ul>
          </div>
        </div>

        <form className="chat-form" onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Например: хочу накопить на машину 1.2 млн, получаю 85 тыс, обязательные платежи 35 тыс, форс-мажоры 10 тыс..."
            rows={7}
          />

          {error && <div className="error-box">{error}</div>}

          <div className="chat-actions">
            <button type="button" className="secondary-button" onClick={useExample} disabled={isLoading}>
              Вставить пример
            </button>
            <button type="submit" className="primary-button" disabled={isLoading || !message.trim()}>
              {isLoading ? 'Считаю план...' : 'Рассчитать план'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
