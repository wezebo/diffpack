# 1. Базовый образ с bun
FROM oven/bun:1.1.6 as builder

# 2. Устанавливаем рабочую директорию
WORKDIR /app

# 3. Копируем зависимости и устанавливаем их
COPY bun.lock package.json vite.config.* tsconfig.* ./
RUN bun install

# 4. Копируем остальной код
COPY . .

# 5. Собираем приложение
RUN bun run build

# 6. Используем nginx для запуска продакшн-версии
FROM nginx:alpine

# 7. Копируем билд в nginx директорию
COPY --from=builder /app/dist /usr/share/nginx/html

# 8. Копируем кастомный конфиг nginx (опционально)
# COPY nginx.conf /etc/nginx/nginx.conf

# 9. Экспонируем порт
EXPOSE 80

# 10. Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]
