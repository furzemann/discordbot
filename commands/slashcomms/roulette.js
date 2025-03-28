const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("roulette")
    .setDescription("Hello world"),
    async execute(interaction) {
        await interaction.deferReply();
        const uuid = interaction.member.id;
        fetch("http://localhost:4000/roulette", {
            method: 'POST',
            body: JSON.stringify({
                uid: uuid,
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