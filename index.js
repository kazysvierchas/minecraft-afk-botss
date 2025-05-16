const fs = require('fs');
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const mineflayer = require('mineflayer');

const config = JSON.parse(fs.readFileSync('./config.json'));
const bots = {};
const jumpInterval = 20 * 60 * 1000; // 20 minučių milisekundėmis

function createBot(username) {
    const bot = mineflayer.createBot({
        host: config.server.host,
        port: config.server.port,
        username
    });

    bot.on('login', () => {
        console.log(`${username} prisijungė prie serverio.`);
    });

    bot.on('end', () => {
        console.log(`${username} atsijungė. Bandom jungtis iš naujo...`);
        setTimeout(() => {
            bots[username] = createBot(username);
        }, 5000);
    });

    bot.on('error', err => console.log(`${username} klaida:`, err));

    // Anti-AFK šokinėjimas kas 20 minučių
    setInterval(() => {
        if (bot.entity && bot.entity.onGround) {
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 500);
        }
    }, jumpInterval);

    return bot;
}

// Discord Botas
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log('Discord botas pasiruošęs.');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const name = interaction.options.getString('name');

    if (!config.bots.includes(name)) {
        return interaction.reply({ content: 'Tokio boto nėra sąraše.', ephemeral: true });
    }

    if (interaction.commandName === 'join') {
        if (bots[name]) return interaction.reply(`${name} jau prisijungęs.`);
        bots[name] = createBot(name);
        interaction.reply(`${name} jungiasi...`);
    } else if (interaction.commandName === 'leave') {
        if (!bots[name]) return interaction.reply(`${name} neprisijungęs.`);
        bots[name].quit();
        delete bots[name];
        interaction.reply(`${name} atsijungė.`);
    } else if (interaction.commandName === 'status') {
        interaction.reply(`${name} statusas: ${bots[name] ? 'Prisijungęs' : 'Atsijungęs'}`);
    }
});

async function registerCommands() {
    const commands = [
        new SlashCommandBuilder().setName('join').setDescription('Jungia botą').addStringOption(opt =>
            opt.setName('name').setDescription('Bot vartotojo vardas').setRequired(true)),
        new SlashCommandBuilder().setName('leave').setDescription('Atsijungia botas').addStringOption(opt =>
            opt.setName('name').setDescription('Bot vartotojo vardas').setRequired(true)),
        new SlashCommandBuilder().setName('status').setDescription('Tikrina boto statusą').addStringOption(opt =>
            opt.setName('name').setDescription('Bot vartotojo vardas').setRequired(true))
    ].map(cmd => cmd.toJSON());

    const rest = new REST({ version: '10' }).setToken(config.discordToken);
    try {
        console.log('Registruojamos slash komandos...');
        await rest.put(Routes.applicationCommands(config.discordClientId), { body: commands });
        console.log('Komandos užregistruotos.');
    } catch (err) {
        console.error('Klaida registruojant komandas:', err);
    }
}

registerCommands();
client.login(config.discordToken);