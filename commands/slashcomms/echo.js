const {
  SlashCommandBuilder,
  MessageFlags,
  EmbedBuilder,
} = require("discord.js");

const embed = new EmbedBuilder()
  .setColor(0xffffff)
  .setTitle("Example Embed")
  .setThumbnail(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ3WOGLiHVhj2Sez-xd4goWrv_pSskAXEZLw&s",
  )
  .setImage("https://i.redd.it/qfs4gktqowy11.jpg")
  .setURL("https://github.com/furzemann");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("messager")
    .setDescription("sending data")
    .addIntegerOption((option) =>
      option
        .setName("repeat")
        .setDescription("Number of times you want to show the text")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Message to be displayed")
        .setRequired(true),
    ),
  async execute(interaction) {
    const count = interaction.options.getInteger("repeat") ?? 1;
    const message =
      interaction.options.getString("message") ?? "No message was given";
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    for (i = 0; i < count; i++) {
      await interaction.channel.send(message);
    }
    await interaction.channel.send({ embeds: [embed] });
    await interaction.editReply("request completed");
  },
};
