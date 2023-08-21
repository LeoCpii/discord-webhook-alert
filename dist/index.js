"use strict";var _github = require('@actions/github');
var _webhookdiscord = require('webhook-discord');
var _core = require('@actions/core');


class DiscordAlert {
    constructor(
         builder,
         hook,
         env
    ) {;this.builder = builder;this.hook = hook;this.env = env; }

    get message() {
        _core.debug.call(void 0, _github.context.payload.repository.html_url)
        _core.debug.call(void 0, _github.context.actor)
    
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

     send() {
        return this.hook.send(this.message);
    }
}

class Env {
    static __initStatic() {this.default = {
        avatar: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        name: 'GitHub',
    }}

    static __initStatic2() {this.state = {
        warn: 'canceled',
        error: 'failed',
        success: 'succeeded',
    }}

    static __initStatic3() {this.type = {
        warn: '#f9a825',
        error: '#f44336',
        success: '#66bb6a',
    }}

     get type() {
        return _core.getInput.call(void 0, 'type')  || 'error';
    }

     get url() {
        return _core.getInput.call(void 0, 'webhookUrl').replace('/github', '');
    }

     get label() {
        return _github.context.ref.replace('refs/tags/', '').replace('refs/heads/', '');
    }

     get customMessage() {
        return _core.getInput.call(void 0, 'message') || `Deployment on stage ${_github.context.payload.repository.name} ${Env.state[this.type]}.`;
    }

     get project() {
        return _core.getInput.call(void 0, 'project') || '';
    }

     get data() {
        return {
            name: _core.getInput.call(void 0, 'name') || Env.default.name,
            avatar: _core.getInput.call(void 0, 'avatar') || Env.default.avatar,
            title: this.customMessage,
            description: _github.context.payload.repository.html_url,
            color: Env.type[this.type],
            author: {
                name: _github.context.actor,
                image: _github.context.payload.sender.avatar_url,
                url: _github.context.payload.sender.html_url,
            },
            branch: {
                title: 'Branch',
                label: this.label,
                inline: false
            },
            workflow: {
                title: 'Workflow',
                label: _github.context.workflow,
                inline: true
            },
            project: {
                title: 'Project',
                label: this.project,
                inline: true
            },
        }
    }
} Env.__initStatic(); Env.__initStatic2(); Env.__initStatic3();

const env = new Env();
const builder = new (0, _webhookdiscord.MessageBuilder)();
const webhook = new (0, _webhookdiscord.Webhook)(env.url);

new DiscordAlert(builder, webhook, env).send().catch((error) => _core.setFailed.call(void 0, error.message));