# Design tokens (единый источник правды для стилей)

Стили не хардкодятся в компонентах — все общие значения задаются в одном месте и используются через Tailwind или CSS-переменные.

## Где что лежит

| Что | Файл | Как использовать |
|-----|------|-------------------|
| **Цвета, радиус, тема** | `app/globals.css` (`:root`, `.dark`) | Классы: `bg-primary`, `text-muted-foreground`, `border-border`, `rounded-lg`, `bg-card` и т.д. |
| **Отступы страницы, ширина контента** | `app/globals.css` (переменные) + `tailwind.config.ts` (theme.extend) | Классы: `p-page`, `md:p-page-md`, `max-w-content`, `max-w-content-narrow` |
| **Шрифты** | `app/layout.tsx` (Geist) + `globals.css` (body) | Через `font-sans` или переменную `--font-geist-sans` |

## Текущие токены в `globals.css`

- **Цвета**: `--background`, `--foreground`, `--primary`, `--muted`, `--card`, `--border`, `--destructive` и др.
- **Радиус**: `--radius` (даёт `rounded-lg`, `rounded-md`, `rounded-sm` в конфиге).
- **Страница**: `--page-padding` (1.5rem), `--page-padding-md` (2.5rem), `--content-max-width` (28rem), `--content-max-width-narrow` (24rem).

## Правила

1. Не использовать «магические» цвета и размеры в разметке — только классы из темы или токены.
2. **Layout**: использовать токены `p-page`, `md:p-page-md`, `max-w-content`, `max-w-content-narrow` вместо хардкода `p-6`, `md:p-10`, `max-w-md`, `max-w-sm`. Значения токенов совпадают с прежними (вид UI сохранён).
3. Если нужен новый общий размер/отступ — добавить переменную в `globals.css` и при необходимости расширить `tailwind.config.ts`, затем использовать в компонентах. Значения токенов должны соответствовать уже используемым (например, `--page-padding: 1.5rem` = `p-6`), чтобы внешний вид не «плыл».
4. Специфичные для одного компонента значения можно оставить в виде Tailwind-класса (`mt-2`, `gap-4`), не вынося в токены.
