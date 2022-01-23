## Prerequisite

### Install Node.js

[Node.js](https://nodejs.org) 10+ is required to run the bot

### Create Discord Bot

1. Create an application using the [discord developer portal](https://discordapp.com/developers)
2. Create a bot for the application
3. Save the bot token for later
4. Add the bot to a server.

## Installation

1. clone this repository
2. install dependencies with: `npm install`

## Configure

The repository contains a file named `config.json` that contains configurable details for the role bot.

The file consists of three fields:

* channel - the channel that contains the role message
* roles - the mapping between reaction emoji and roles.
* role - role to assign

The bot will watch the first message in the specified channel.  If a reaction is added or removed from this message, the bot will add or remove the corresponding role.
