require('dotenv/config');
const { Client, GatewayIntentBits } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

// Create a new Discord client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Log in to Discord with your bot's token
client.login(process.env.TOKEN);

// Configuration for OpenAI
const configuration = new Configuration({
    apiKey: process.env.API_KEY
});
const openai = new OpenAIApi(configuration);

// Define your fine-tuned model name using the environment variable
const FINE_TUNED_MODEL = process.env.FINE_TUNED_MODEL; // Use the environment variable

// Event listener for when the bot is ready
client.on('ready', () => {
    console.log('The bot is on!');
});

// Event listener for when a message is created
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith('!')) return;

    try {
        // Create a chat completion request using the fine-tuned model
        const response = await openai.createChatCompletion({
            model: FINE_TUNED_MODEL,
            messages: [
                {
                    role: 'system',
                    content: 'Hello! I\'m QuantumChat, here to assist you with any questions you have about our server. Whether you need help accessing the server with Tailscale, understanding the server rules, or anything else, feel free to ask!'
                },
                {
                    role: 'user',
                    content: message.content
                }
            ]
        });

        // Reply to the message with the AI's response
        message.reply(response.data.choices[0].message.content);
    } catch (error) {
        console.error('OpenAI ERROR:', error.response ? error.response.data : error.message);
        message.reply('Sorry, something went wrong while processing your request.');
    }
});
