const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chatting")
    .setDescription("Send a message to the server and get a response.")
    .addIntegerOption((option) =>
      option
        .setName("mode")
        .setDescription("set a mode for the chatbot")
        .setRequired(true)
        .addChoices(
          { name: "helpful", value: 0},
          { name: "chill", value: 1 },
          { name: "dominating", value: 2},
          { name: "stoned", value: 3},
          { name: "Tony Soprano", value: 4},
          {name: "brainrot", value: 5},
        )
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const uuid = interaction.user.id;
const option = interaction.options.getInteger("mode");
    // Function to send the message to the server and get a response
    const getresp = async (message) => {
      try {
        const response = await fetch("http://localhost:4000/chat", {
          method: "POST",
          body: JSON.stringify({
            uid: uuid,
            message: message,
            option: option
          }),
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        });

        const rawResponse = await response.text();
        const data = JSON.parse(rawResponse);

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

    // Send an initial reply
    await interaction.editReply("Comment below to get an AI response. Type `end` to stop the conversation.");

    // Function to create a new collector
    const createCollector = () => {
      const filter = (msg) => msg.author.id === interaction.user.id;

      const collector = interaction.channel.createMessageCollector({
        filter,
        time: 60_000, // Collector will stop after 60 seconds of inactivity
      });

      // Handle collected messages
      collector.on("collect", async (msg) => {
        if (msg.content.toLowerCase() === "end") {
          collector.stop(); // Stop the collector if the user types "end"
          await interaction.followUp("Conversation has ended.");
        } else {
          const reply = await getresp(msg.content); // Get the response from the server
          await msg.reply(reply); // Reply to the user's message

          // Stop the current collector and create a new one
          collector.stop();
          createCollector();
        }
      });

      // Handle the end of the collection
      collector.on("end", async (collected, reason) => {
        if (reason !== "user") {
          await interaction.followUp("The chat session has ended due to inactivity.");
        }
      });
    };

    // Start the initial collector
    createCollector();
  },
};