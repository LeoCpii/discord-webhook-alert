import { context } from '@actions/github';
import { MessageBuilder, Webhook } from 'webhook-discord';
import { getInput, setFailed, debug } from '@actions/core';

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
            .addField(this.env.data.project.title, this.env.data.project.label, this.env.data.project.inline)
            .addField(this.env.data.workflow.title, this.env.data.workflow.label, this.env.data.workflow.inline)
            .addField(this.env.data.branch.title, this.env.data.branch.label, this.env.data.branch.inline)
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

    public get label(): string {
        return context.ref.replace('refs/tags/', '').replace('refs/heads/', '');
    }

    public get customMessage(): string {
        return getInput('message') || `Deployment on stage ${context.payload.repository.name} ${Env.state[this.type]}.`;
    }

    public get project(): string {
        return getInput('project') || '';
    }

    public get data() {
        return {
            name: getInput('name') || Env.default.name,
            avatar: getInput('avatar') || Env.default.avatar,
            title: this.customMessage,
            description: context.payload.repository.html_url,
            color: Env.type[this.type],
            author: {
                name: context.actor,
                image: context.payload.sender.avatar_url,
                url: context.payload.sender.html_url,
            },
            branch: {
                title: 'Branch',
                label: this.label,
                inline: false
            },
            workflow: {
                title: 'Workflow',
                label: context.workflow,
                inline: true
            },
            project: {
                title: 'Project',
                label: this.project,
                inline: true
            },
        }
    }
}

const env = new Env();
const builder = new MessageBuilder();
const webhook = new Webhook(env.url);

new DiscordAlert(builder, webhook, env).send().catch((error) => setFailed(error.message));