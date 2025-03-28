const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("getuserinfo")
    .setDescription("Get your info"),
    async execute(interaction) {
        await interaction.deferReply();
        const uuid = interaction.member.id;
        fetch(`http://localhost:4000/data/${uuid}`)
        .then(response =>response.json())
        .then(data => {
            console.log(data);
            interaction.editReply(`You have ${data.money} and ${data.items}`);
        })
        .catch(error => {
            console.error("Error: ",error);
            interaction.editReply("failure");
        });
    },
};
 