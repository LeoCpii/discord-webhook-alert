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

usa: ações/hello-world-javascript-action@v1.1
com:
  quem cumprimentar: 'Mona, a Octocat'