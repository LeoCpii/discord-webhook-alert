"use strict";var _core = require('@actions/core');
var _github = require('@actions/github');
var _webhookdiscord = require('webhook-discord');

class DiscordAlert {
    constructor(
         builder,
         hook,
         env
    ) {;this.builder = builder;this.hook = hook;this.env = env; }

    get message() {
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

     async send() {
        await this.hook.send(this.message);
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

     get url() {
        return _core.getInput.call(void 0, 'webhookUrl').replace('/github', '');
    }

     get data() {
        return {
            name: _core.getInput.call(void 0, 'name') || Env.default.name,
            avatar: _core.getInput.call(void 0, 'avatar') || Env.default.avatar,
            title: `Deployment on stage ${_github.context.payload.repository.name} ${Env.state[_core.getInput.call(void 0, 'type')]}.`,
            description: _github.context.payload.repository.html_url,
            color: Env.type[_core.getInput.call(void 0, 'type')],
            branch: {
                title: 'Branch',
                label: _github.context.ref,
                inline: true
            },
            time: {
                title: 'Workflow',
                label: _github.context.workflow,
                inline: true
            },
            author: {
                name: _github.context.actor,
                image: _github.context.payload.sender.avatar_url,
                url: _github.context.payload.sender.html_url,
            }
        }
    }
} Env.__initStatic(); Env.__initStatic2(); Env.__initStatic3();

const env = new Env();
const builder = new (0, _webhookdiscord.MessageBuilder)();
const webhook = new (0, _webhookdiscord.Webhook)(env.url);

new DiscordAlert(builder, webhook, env).send();

// var teste = {
//     "content": null,
//     "embeds": [
//         {
//             "title": "Deployment on stage id-app succeeded.",
//             "description": "https://github.com/Ben-Pet/id-app",
//             "color": 6732650,
//             "fields": [
//                 {
//                     "name": "Branch",
//                     "value": "1.0.0",
//                     "inline": true
//                 },
//                 {
//                     "name": "Time to deploy",
//                     "value": "00:01:15",
//                     "inline": true
//                 }
//             ],
//             "author": {
//                 "name": "Leonardo Gonçalves",
//                 "url": "https://github.com/LeoCpii",
//                 "icon_url": "https://avatars.githubusercontent.com/u/41125412?v=4"
//             },
//             "timestamp": "2021-05-05T03:00:00.000Z"
//         }
//     ],
//     "username": "Deploy",
//     "avatar_url": "https://cdn4.iconfinder.com/data/icons/whsr-january-flaticon-set/512/rocket.png"
// }

// var teste = {
//     name: 'Deploy',
//     avatar: 'https://cdn4.iconfinder.com/data/icons/whsr-january-flaticon-set/512/rocket.png',
//     title: 'Deployment on stage id-app succeeded.',
//     description: 'https://github.com/Ben-Pet/id-app',
//     color: Alerts.type['error'],
//     branch: {
//         title: 'Branch',
//         label: '1.0.0',
//         inline: true
//     },
//     time: {
//         title: '',
//         label: 'Time to deploy',
//         inline: true
//     },
//     author: {
//         name: 'Leonardo Gonçalves',
//         image: 'https://avatars.githubusercontent.com/u/41125412?v=4',
//         url: 'https://github.com/LeoCpii',
//     }
// }