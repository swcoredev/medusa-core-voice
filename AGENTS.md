# medusa-core-voice — AGENTS

## Роли и ветки
- ARCHITECT — ветка: arc/core — владелец архитектурных артефактов, единый манифест, правила ветвления
- BACKEND   — ветка: dev/be/cursor — владелец packages/backend
- FRONTEND  — ветка: dev/fe/gpt    — владелец packages/frontend

## Правила веток
- Работа ведётся в своих ветках: arc/core, dev/be/cursor, dev/fe/gpt
- Интеграция: feature-ветки → **staging** → **main**
- Коммиты помечаем префиксами: [ARC], [BE], [FE]

## Документы
- В корне: этот файл AGENTS.md (манифест)
- В командах: Request.md в packages/backend и packages/frontend (карточка задач/рамок)
