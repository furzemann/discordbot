const { SlashCommandBuilder } = require("discord.js");
const { cacheMap } = require("../../utils/cache");

//Really basic fetch implementation. I currently have a server running on dogshit code

//TODO: Add a autocomplete feature for search and give a dynamic list. The current option is not feasible for multiple servers.
module.exports = {
  data: new SlashCommandBuilder()
    .setName("chatting")
    .setDescription("Send a message to the server and get a response.")
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Get The Character to use')
        .setRequired(true)
        .addChoices(
					{ name: 'Miku', value: 'Hatsune Miku' },
					{ name: 'Walter', value: 'Walter White' })),
  async execute(interaction) {
    await interaction.deferReply();
    const option = interaction.options.getString("query");
    const instruction = cacheMap.get(option);
    const getresp = async (message,id) => {
      try {
        const response = await fetch("http://localhost:4000/chat", {
          method: "POST",
          body: JSON.stringify({
            uid: id,
            message: message,
            instructions : instruction,
          }),
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        });

        const data = await response.json();
        console.log(data);
        if (response.ok && data.reply) {
          return data.reply;
        } else {
          return "The server did not return a valid response.";
        }
      } catch (error) {
        console.error("Error:", error);
        return "A problem occurred while processing your request.";
      }
    };

    await interaction.editReply("Comment below to get an AI response. Type `end` to stop the conversation.");

    const createCollector = () => {
      const collectorFilter = m => !m.author.bot;
      const collector = interaction.channel.createMessageCollector({
        filter: collectorFilter,
        time: 60_000, 
      });
      
      collector.on("collect", async (msg) => {
        if (msg.content.toLowerCase() === "end") {
          collector.stop(); 
          await interaction.followUp("Conversation has ended.");
        } else {

          const botreply = await msg.reply('thinking...');
          const uuid = msg.author.id; 
          const reply = await getresp(msg.content,uuid); 
          await botreply.edit(`**${option}**: ${reply}`);
          collector.stop();
          createCollector();
        }
      });

      collector.on("end", async (collected, reason) => {
        if (reason !== "user") {
          await interaction.followUp("The chat session has ended due to inactivity.");
        }
      });
    };

    createCollector();
  },
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();

    const results = await search(focusedValue);
    const validResults = results.filter(item => item.instruction && item.instruction.trim() !== "");
    await interaction.respond(
      validResults.slice(0, 25).map(item => ({
        name: item.name,
        value: item._id,
      }))
    );
  },
  }
