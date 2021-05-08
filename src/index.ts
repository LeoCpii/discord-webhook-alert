import { getInput, setFailed, debug, info } from '@actions/core';
import { context } from '@actions/github';
import { MessageBuilder, Webhook } from 'webhook-discord';

type TValidType = 'warn' | 'error' | 'success';

class DiscordAlert {
    constructor(
        private builder: MessageBuilder,
        private hook: Webhook,
        private env: Env
    ) { }

    get message(): MessageBuilder {
        debug(context.payload.repository.html_url)
        debug(context.actor)
        return this.builder
            .setName(this.env.data.name)
            .setAvatar(this.env.data.avatar)
            .setTitle(this.env.data.title)
            .setDescription(this.env.data.description)
            .setColor(this.env.data.color)
            .addField(this.env.data.branch.title, this.env.data.branch.label, this.env.data.branch.inline)
            .addField(this.env.data.time.title, this.env.data.time.label, this.env.data.time.inline)
            .setAuthor(this.env.data.author.name, this.env.data.author.image, this.env.data.author.url)
            .setTime();
    }

    public send(): Promise<void> {
        return this.hook.send(this.message);
    }
}

class Env {
    static default = {
        avatar: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        name: 'GitHub',
    }

    static state = {
        warn: 'canceled',
        error: 'failed',
        success: 'succeeded',
    }

    static type = {
        warn: '#f9a825',
        error: '#f44336',
        success: '#66bb6a',
    }

    private get type(): TValidType {
        return getInput('type') as TValidType || 'error';
    }

    public get url(): string {
        return getInput('webhookUrl').replace('/github', '');
    }

    public get data() {
        return {
            name: getInput('name') || Env.default.name,
            avatar: getInput('avatar') || Env.default.avatar,
            title: `Deployment on stage ${context.payload.repository.name} ${Env.state[this.type]}.`,
            description: context.payload.repository.html_url,
            color: Env.type[this.type],
            branch: {
                title: 'Branch',
                label: context.ref,
                inline: true
            },
            time: {
                title: 'Workflow',
                label: context.workflow,
                inline: true
            },
            author: {
                name: context.actor,
                image: context.payload.sender.avatar_url,
                url: context.payload.sender.html_url,
            }
        }
    }
}

const env = new Env();
const builder = new MessageBuilder();
const webhook = new Webhook(env.url);

new DiscordAlert(builder, webhook, env).send().catch((error) => setFailed(error.message));