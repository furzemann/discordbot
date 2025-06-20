const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
        .setName("modify_image")
        .setDescription("Modify your image by using common filters")
        .addStringOption(option =>
			  option.setName('modification')
				.setDescription('What do you want to do to your image.')
				.setRequired(true)
				.addChoices(
					{ name: 'greyscale', value: 'grayscale' },
					{ name: 'saturate', value: 'saturate' },
				))
        .addAttachmentOption(option =>
            option.setName("image")
            .setDescription("image you want to tweak")
            .setRequired(true)),
  async execute(interaction) {
    const img = interaction.options.getAttachment("image");
    const option = interaction.options.getString("modification");
    //TODO: do something with the image using api fetching in some fast language;
    console.log(img,option);
    await interaction.reply("Wait for your request it might take some time");
    await interaction.editReply({content:"Here's your request",files: [img.url]});
  } 
}
