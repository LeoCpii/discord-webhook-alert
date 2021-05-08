# Discord Webhook Alert

Send notifications to Discord using a webhook.

## Inputs

### `webhookUrl`

**Required** Discord webhook URL. Should be stored in a secret and inserted as a context expression.

### `type`

**Optional** info, warn, or error.

### `name`

**Optional** Webhook name`.

### `avatar`

**Optional** Webhook avatar.

## Exemplo de uso

```yml
uses: LeoCpii/discord-webhook-alert@v1.0.0
with:
  webhookUrl: ${{ secrets.DISCORD_WEBHOOK }}
```
