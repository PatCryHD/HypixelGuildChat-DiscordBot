//TODO Add filter for discord-ig guild chat

const Minecraft = require('mineflayer');
const { mineflayer: mineflayerViewer } = require('prismarine-viewer')
const Discord = require('discord.js');
const BotConfig = require('./botConfig.json');
const DiscordClient = new Discord.Client();
const BannedPhrases = ["youtube.com", "cunt", "bitch", "nigga", "nigger", "sex", "cum", "dick", "fuck"];
let MinecraftBot = Minecraft.createBot({
    host: BotConfig.host,
    port: BotConfig.port,
    username: BotConfig.username,
    password: BotConfig.password
});
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }  
const info = (message) => {
    console.log("[INFO] " + message);
}
const chat = (message) => {
    console.log("[CHAT] " + message);
}
const warn = (message) => {
    console.warn("[WARN] " + message);
}
const error = (message) => {
    console.error("[ERROR] " + message);
}

const reattachlistners = () => {
    MinecraftBot.once('spawn', () => {
        info("Spawned into world!");
        MinecraftBot.on('end', () => {
            error("I was kicked from " + BotConfig.host + ". Relogging!");
            DiscordClient.channels.cache.get(BotConfig.messageLoggingChannel).send("I've been kicked from " + BotConfig.host + "!");
            MinecraftBot = Minecraft.createBot({
                host: BotConfig.host,
                port: BotConfig.port,
                version: "1.8.9",
                username: BotConfig.username,
                password: BotConfig.password
            });
            MinecraftBot.on('end', () => {
            error("I was kicked from " + BotConfig.host + ". Relogging!");
            MinecraftBot = Minecraft.createBot({
                host: BotConfig.host,
                port: BotConfig.port,
                username: BotConfig.username,
                password: BotConfig.password
            });
            reattachlistners();
        })
        })
        
        MinecraftBot.on('messagestr', (message) => {
            chat(message);
            let parsedMessage = parse(message);
            if (parsedMessage != null) {
                if (parsedMessage[0] != "JustPrettyBoy" && parsedMessage[1] != null) {
                DiscordClient.channels.cache.get(BotConfig.messageLoggingChannel).send(new Discord.MessageEmbed()
                .setColor('#32d600')
                .setTitle(parsedMessage[0])
                .setFooter("Hypixel Portal", "https://mc-heads.net/avatar/" + parsedMessage[0])
                .setURL("http://namemc.com/profile/" + parsedMessage[0])
                .setDescription(parsedMessage[1])
                .setTimestamp()
                );
                }
                
            }
        });
        
        })
}

const init = () => {
    const embed = new Discord.MessageEmbed()
        .setColor(0x00AE86)
        .setDescription("Hypixel Guild Livechat initiated.")
        .setTimestamp();

    DiscordClient.channels.cache.get(BotConfig.messageLoggingChannel).send(embed);
    MinecraftBot.once('spawn', () => {
        mineflayerViewer(MinecraftBot, { port: 80, firstPerson: false });
        info("Spawned into world!");
        MinecraftBot.on('end', () => {
            error("I was kicked from " + BotConfig.host + ". Relogging!");
            DiscordClient.channels.cache.get(BotConfig.messageLoggingChannel).send("I've been kicked from " + BotConfig.host + "!");
            MinecraftBot = Minecraft.createBot({
                host: BotConfig.host,
                port: BotConfig.port,
                version: "1.8.9",
                username: BotConfig.username,
                password: BotConfig.password
            });
            MinecraftBot.on('end', (reason, loggedIn) => {
            error("I was kicked from " + BotConfig.host + ". Relogging!");
            MinecraftBot = Minecraft.createBot({
                host: BotConfig.host,
                port: BotConfig.port,
                username: BotConfig.username,
                password: BotConfig.password
            });
            reattachlistners();
        })
        })
        
        MinecraftBot.on('messagestr', (message) => {
            chat(message);
            let parsedMessage = parse(message);
            if (parsedMessage != null) {
                if (parsedMessage[0] != "JustPrettyBoy" && parsedMessage[1] != null) {
                DiscordClient.channels.cache.get(BotConfig.messageLoggingChannel).send(new Discord.MessageEmbed()
                .setColor('#32d600')
                .setTitle(parsedMessage[0])
                .setFooter("Hypixel Portal", "https://mc-heads.net/avatar/" + parsedMessage[0])
                .setURL("http://namemc.com/profile/" + parsedMessage[0])
                .setDescription(parsedMessage[1])
                .setTimestamp()
                );
                }
                
            }
        });
        
        })
}
let parse = (str) => {
const colorcodes = ["§0", "§1", "§2", "§3", "§4", "§5", "§6", "§7", "§8", "§9", "§a", "§b", "§c", "§d", "§e", "§f", "§l", "§n", "§o", "§m", "§k", "§r",];
for (i = 0; i < colorcodes.length; i++) {
    str = str.replace(colorcodes[i], "");
}

if (str.startsWith("Guild > ")) {
    let player = null;
    let message = null;
    let pmessage = "";
    str = str.slice(8);
    message = str.split(":");
    
    if (message.length > 2) {
        for (i = 0; i < message.length; i++) {
            if (i > 0) {
                if (i == 1) {
                    pmessage = pmessage + message[i];
                } else {
                    pmessage = pmessage + ":" + message[i];
                }
            }
        }
    } else {
        pmessage = message[1];
    }
    str = str.split(":")[0].split(" ");
    if (str.length == 1) {
        return [str[0], pmessage];
    } else {
        return [str[1], pmessage];
    }
}

}


const onStart = () => {
    info("Starting HypixelGuild-Discord bridge bot...");
    info("Logging onto Discord...");
    DiscordClient.login(BotConfig.discordBotToken);
    DiscordClient.once('ready', () => {
        info("Connected to Discord and successfully logged in!");
        init();
        DiscordClient.user.setActivity("over Hypixel Portal", { type: "WATCHING"});
        DiscordClient.on('message', message => {
            if (message.channel.id == BotConfig.messageLoggingChannel && message.member.id != "837953384182579211") {
                let invalid = false;
                for (i = 0; i < BannedPhrases.length; i++) {
                    let loweredMessage = message.content.toLowerCase();
                    if (loweredMessage.includes(BannedPhrases[i])) {
                        if (message.deletable) {
                            message.channel.send("<@!" + message.member.id + ">, your message contains banned phrases and cannot be sent.");
                            message.delete();
                            invalid = true;
                        } else {
                            message.channel.send("<@!" + message.member.id + ">, your message contains banned phrases and cannot be sent.");
                            invalid = true;
                        }
                    }
                }
                if (!invalid) {
                    // TODO Replace mentions with user's Discord tag.
                    MinecraftBot.chat("/gc " + "[DISCORD] " + message.member.user.tag + ": " + message.cleanContent);
                    message.react('✅');
                    message.channel.send(new Discord.MessageEmbed()
                    .setTitle(message.member.user.tag)
                    .setColor('#4287f5')
                    .setDescription(message.cleanContent)
                    .setFooter("Hypixel Portal", message.guild.iconURL())
                    .setTimestamp());
                }
            }
        });
    });
}

onStart();




//TODO Parse and post embed on Discord. 