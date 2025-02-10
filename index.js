const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const client = new Client({ intents: 
                                [GatewayIntentBits.Guilds,
                                GatewayIntentBits.GuildMessages,
                                GatewayIntentBits.GuildMembers,
                                GatewayIntentBits.DirectMessages] });

client.on("messageCreate",async (message)=>{
    console.log(message);

    if (!message?.author.bot){
        message.author.send(`Echo ${message.id}`);
    }
})

client.login(token);


