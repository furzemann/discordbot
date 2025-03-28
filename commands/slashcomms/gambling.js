const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("gamble")
    .setDescription("Hello world")
    .addIntegerOption((option) => 
    option
    .setName("amount")
    .setDescription("Amount to be gambled")
    .setRequired(true))
    .addBooleanOption((option) => 
    option
    .setName("reset")
    .setDescription("resetaccount?")),
    async execute(interaction) {
        await interaction.deferReply();
        const amount = interaction.options.getInteger("amount");
        const uuid = interaction.user.id;
        const reset = interaction.options.getBoolean("reset");
        fetch("http://localhost:4000/post", {
            method: 'POST',
            body: JSON.stringify({
                uid: uuid,
                gamble: amount,
                rst: false,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then(response => response.json())
        .then(data => {console.log(data);
    interaction.editReply(data.ans)})
        .catch(error => {console.error("Error: ",error);
            interaction.editReply("A problem occured");
        });
    },
};