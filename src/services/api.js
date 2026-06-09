const API_MODE = 'mock'; // поменяйте на 'real', когда подключите настоящий API

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function extractNumberAfter(text, markers) {
  const normalized = text.toLowerCase().replace(/,/g, '.');

  for (const marker of markers) {
    const pattern = new RegExp(`${marker}[^0-9]*(\\d+(?:\\.\\d+)?)\\s*(млн|миллион|миллиона|миллионов|тыс|тысяч|к)?`, 'i');
    const match = normalized.match(pattern);

    if (match) {
      const value = Number(match[1]);
      const unit = match[2] || '';

      if (unit.includes('млн') || unit.includes('милли')) return Math.round(value * 1_000_000);
      if (unit.includes('тыс') || unit.includes('к')) return Math.round(value * 1_000);
      return Math.round(value);
    }
  }

  return null;
}

function extractGoal(text) {
  const lower = text.toLowerCase();

  if (lower.includes('машин') || lower.includes('авто') || lower.includes('автомоб')) return 'машина';
  if (lower.includes('квартир') || lower.includes('ипотек')) return 'квартира';
  if (lower.includes('отпуск') || lower.includes('путешеств')) return 'путешествие';
  if (lower.includes('ремонт')) return 'ремонт';

  return 'финансовая цель';
}

function calculateCompletionDate(monthsNeeded) {
  const date = new Date();
  date.setDate(1);
  date.setMonth(date.getMonth() + Math.max(monthsNeeded - 1, 0));
  return date.toISOString().slice(0, 10);
}

async function mockFetch(userMessage) {
  await delay(650);

  const goal = extractGoal(userMessage);
  const goalAmount =
    extractNumberAfter(userMessage, ['накопить', 'цель', 'машин[ауые]', 'авто', 'сумм[ау]', 'стоимость']) ||
    1_200_000;

  const monthlyIncome =
    extractNumberAfter(userMessage, ['получаю', 'доход', 'зарплат[ауы]', 'зарабатываю']) ||
    85_000;

  const mandatoryExpenses =
    extractNumberAfter(userMessage, ['обязательные платежи', 'кредиты', 'платежи', 'обязательные траты']) ||
    35_000;

  const safetyNet =
    extractNumberAfter(userMessage, ['форс-мажоры', 'лечение', 'подарки', 'одежду', 'развлечения', 'защитный слой']) ||
    10_000;

  const freeForSavings = monthlyIncome - mandatoryExpenses - safetyNet;
  const monthsNeeded = freeForSavings > 0 ? Math.ceil(goalAmount / freeForSavings) : 0;

  return {
    goal,
    goal_amount: goalAmount,
    monthly_income: monthlyIncome,
    mandatory_expenses: mandatoryExpenses,
    safety_net: safetyNet,
    free_for_savings: freeForSavings,
    months_needed: monthsNeeded,
    completion_date: monthsNeeded > 0 ? calculateCompletionDate(monthsNeeded) : null,
    recommendations: [
      'Откладывать деньги сразу после зарплаты, а не в конце месяца',
      'Проверить обязательные платежи и подписки: даже минус 5 000 ₽ в месяц заметно сокращает срок',
      'Держать защитный слой отдельно от денег на цель, чтобы не срывать план накоплений'
    ]
  };
}

export async function callFinanceAPI(userMessage) {
  if (API_MODE === 'mock') {
    return mockFetch(userMessage);
  }

  // ЗАМЕНИТЕ НА РЕАЛЬНЫЙ API: тут ваш URL и ключ
  const API_URL = 'https://your-api-url.example.com/v1/chat/completions';
  const API_KEY = 'YOUR_API_KEY_HERE';

  const prompt = `
Ты — финансовый помощник. Из сообщения пользователя извлеки JSON с полями:
goal, goal_amount, monthly_income, mandatory_expenses, safety_net, free_for_savings, months_needed, completion_date, recommendations.

Правила:
1. Все суммы верни числами в рублях.
2. free_for_savings = monthly_income - mandatory_expenses - safety_net.
3. months_needed = ceil(goal_amount / free_for_savings), если free_for_savings > 0.
4. completion_date верни в формате YYYY-MM-DD.
5. Если данных не хватает, разумно дополни из контекста.
6. Верни только валидный JSON без markdown.

Сообщение пользователя: "${userMessage}"
`;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: 'your-model-name',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2
    })
  });

  if (!response.ok) {
    throw new Error('API вернул ошибку. Проверьте URL, ключ и формат запроса.');
  }

  const data = await response.json();

  // Для OpenAI-compatible API обычно ответ лежит здесь:
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('API не вернул текст ответа с JSON.');
  }

  return JSON.parse(content);
}
