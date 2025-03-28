const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

const { ApiKey } = require("../../config.json");

const refresh = new ButtonBuilder()
  .setLabel("refresh")
  .setCustomId("refresh")
  .setStyle(ButtonStyle.Secondary);

const row = new ActionRowBuilder().addComponents(refresh);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nasasearch")
    .setDescription("Get Some NASA news/API"),

  async execute(interaction) {
    await interaction.deferReply();
    try {
      const fetch = (await import("node-fetch")).default;
      const response = await fetch(
        `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=DEMO_KEY`,
      );
      const data = await response.json();

      if (!data.photos || data.photos.length === 0) {
        await interaction.editReply("No photos found.");
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle(data.photos[0].rover.name)
        .setImage(data.photos[0].img_src)
        .setDescription("Some Image from NASA Rover");
      console.log(embed);
      await interaction.editReply({ embeds: [embed], components: [row] });
    } catch (error) {
      console.error(error);
      await interaction.editReply(
        "There was an error while fetching data from NASA API.",
      );
    }
  },
};
