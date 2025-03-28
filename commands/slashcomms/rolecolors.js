const { SlashCommandBuilder } = require("discord.js");
const { buffer } = require("node:stream/consumers");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rolecolor") // Use a hyphen or underscore instead of a space
    .setDescription("Gives color role")
    .addStringOption((option) =>
      option
        .setName("color")
        .setDescription("Pick this?")
        .setRequired(true)
        .addChoices(
          { name: "cyan", value: "cyan" },
          { name: "black", value: "black" },
          { name: "silver", value: "silver" },
        ),
    ),

  async execute(interaction) {
    const roleList = ["cyan", "black", "silver"];
    const option = interaction.options.getString("color");
    const role = interaction.guild.roles.cache.find(
      (role) => role.name === option,
    );
    if (role) {
      const memberRoles = interaction.member.roles.cache.map(
        (role) => role.name,
      );
      memberRoles.forEach((currole) => {
        if (roleList.includes(currole)) {
          const buffer = interaction.guild.roles.cache.find(
            (buffer) => buffer.name === currole,
          );
          interaction.member.roles.remove(buffer);
        }
      });
      await interaction.member.roles.add(role);
      await interaction.reply(`Role ${option} has been added to you.`);
    } else {
      await interaction.reply(`Role ${option} not found.`);
    }
  },
};
