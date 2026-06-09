# Деплой на GitHub Pages

Проект подготовлен для публикации по адресу:

https://nikolaiskr.github.io/ai/

В `vite.config.js` уже указано:

```js
base: '/ai/'
```

## Что загрузить в репозиторий

Загружайте в репозиторий не отдельные jsx-файлы, а всю структуру проекта:

- package.json
- vite.config.js
- index.html
- src/
- .github/workflows/deploy.yml

## Настройки GitHub

Repository → Settings → Pages → Source → GitHub Actions

После push в main сайт соберётся автоматически.
