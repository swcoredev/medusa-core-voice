project: medusa-core-voice

AGENTS:
  - ARCHITECT (ROLE=ARCHITECT, BRANCH=arc/core)
  - BACKEND   (ROLE=BACKEND,  BRANCH=dev/be/cursor)
  - FRONTEND  (ROLE=FRONTEND, BRANCH=dev/fe/gpt)

RULES:
  - Все PR сначала идут в staging
  - Архитектор мержит staging → main
  - Только архитектор работает с main
