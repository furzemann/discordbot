const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
      .setName("echo")
      .setDescription("echo's a message"),
  async execute(interaction) {
    await interaction.reply("Expect a suprise in your DMs 😏.")
    const collectorFilter = m => !m.author.bot;
    const collector = interaction.channel.createMessageCollector({
      filter: collectorFilter,
      time: 60_000, 
    });
    collector.on("collect", async (msg) =>
    {
        msg.author.send(msg.content);
    });
    collector.on("end", async (msg) =>
    {  interaction.editReply("You didn't respond 🥲")});

  },
}
