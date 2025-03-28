const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

const { NewsApi } = require("../../config.json");

const createButton = (label, customId, style) => {
  return new ButtonBuilder()
    .setLabel(label)
    .setCustomId(customId)
    .setStyle(style);
};

const createRow = (disabledButtonId) => {
  return new ActionRowBuilder().addComponents(
    createButton("general", "general", ButtonStyle.Primary).setDisabled(
      disabledButtonId === "general",
    ),
    createButton("health", "health", ButtonStyle.Primary).setDisabled(
      disabledButtonId === "health",
    ),
    createButton("technology", "technology", ButtonStyle.Primary).setDisabled(
      disabledButtonId === "technology",
    ),
    createButton("Next", "forwards", ButtonStyle.Secondary),
    createButton("delete", "delete", ButtonStyle.Danger),
  );
};

const search = async (category) => {
  const fetch = (await import("node-fetch")).default;
  const response = await fetch(
    `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${NewsApi}`,
  );
  const data = await response.json();
  datasize = data.articles.length;
  return data;
};

const createEmbed = (article) => {
  return new EmbedBuilder()
    .setTitle(article.title)
    .setURL(article.url)
    .setDescription(article.description)
    .setImage(article.urlToImage)
    .addFields({
      name: "Article No.",
      value: `${idx + 1} out of ${datasize}`,
      inline: true,
    });
};

let curr = "general";
let idx = 0;
let datasize = 0;
const cache = {};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("news")
    .setDescription("Get Some News"),

  async execute(interaction) {
    await interaction.deferReply();
    try {
      const data = await search(curr);

      if (!data.articles || data.articles.length === 0) {
        await interaction.editReply("No news found.");
        return;
      }

      const embed = createEmbed(data.articles[0]);
      await interaction.editReply({
        embeds: [embed],
        components: [createRow(curr)],
      });
    } catch (error) {
      console.error(error);
      await interaction.editReply(
        "There was an error while fetching data from the News API.",
      );
    }
  },

  async buttonInteraction(interaction) {
    if (interaction.customId === "delete") {
      await interaction.deferUpdate();
      await interaction.deleteReply();
      return;
    }

    if (interaction.customId === "forwards") {
      await interaction.deferUpdate();
      idx += 1;
      if (idx >= datasize) {
        idx = 0;
      }
      const embed = createEmbed(cache[curr][idx]);
      await interaction.editReply({
        embeds: [embed],
        components: [createRow(curr)],
      });
      return;
    }

    if (["general", "health", "technology"].includes(interaction.customId)) {
      await interaction.deferUpdate();
      try {
        curr = interaction.customId;
        if (!cache[curr]) {
          const data = await search(curr);
          cache[curr] = data.articles;
        }

        if (!cache[curr] || cache[curr].length === 0) {
          await interaction.editReply("No news found.");
          return;
        }
        const embed = createEmbed(cache[curr][0]);

        await interaction.editReply({
          embeds: [embed],
          components: [createRow(curr)],
        });
      } catch (error) {
        console.error(error);
        await interaction.editReply(
          "There was an error while fetching data from the News API.",
        );
      }
    }
  },
};
