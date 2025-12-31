To run the server for the bot locally,

1. Set up the Discord Bot
    1. Go to the [Discord Developer Portal](https://discord.com/developers/applications) and create a new application.
    1. Go to the `OAuth2` page of the Application Seetings for your Discord Bot, and select the `bot` scope. Give it the `Send Messages` and `Send Messages in Threads` permissions.
    1. You can now invite your bot to Discord servers with the generated URL.
1. Create a MongoDB cluster and keep track of the username and password.
1. Create a `config.json` file in the project root directory with the following attributes:
    1. `discordBotToken`, storing the token for your Discord bot (can be found under `Bot` on the Application Settings page after creating a new application. You may have to reset the token to see it.
    1. `discordBotClientId`, storing the bot's application ID, found under `General Information` on the Application Settings page.
    1. `mongoUsername`, storing the username for your MongoDB cluster.
    1. `mongoPassword`, storing the password for your cluster.
1. Run `pnpm deploy-commands` to deploy slash commands for the bot.
1. Run `pnpm start` to start the server. The bot should now be online!
