const { readdirSync } = require("fs");
const { Blob } = require("node:buffer");
const { token, MongoDB } = require("./config.js");
const {
  Client,
  Intents,
  Collection,
  WebhookClient,
  MessageEmbed,
} = require("discord.js");
const isImageURL = require('is-img')
const db = require("pro.db")
const mongoose = require("mongoose");
const { Server , User } = require("./Classes/Classes.js");
const conv = require("converter-hijri.js")
mongoose.connect(`${MongoDB}`, { useNewUrlParser: true }, () => {
  console.log("Connected To Database");
});



const client = new Client({
  restRequestTimeout: 30000,
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
  ],
});

client.commands = [];

const eventsFiles = readdirSync("./Events/").filter((f) => f.endsWith(".js"));
eventsFiles.map((file) => {
  const event = require(`./Events/${file}`);
  try {
    if (event.once) {
      client.once(event.name, (...args) =>
        event.execute(...args, client)
      );
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  } catch (err) {
    console.error(err);
  }
});

const folders = readdirSync("./Commands/");
folders.map((folder) => {
  let folderCommandsDir = "./Commands" + `/${folder}`;
  let folderCommands = readdirSync(folderCommandsDir);
  return folderCommands.map((cmd) => {
    let commandDir = folderCommandsDir + `/${cmd}`;
    if (!cmd.endsWith(".js")) return;
    let command = require(commandDir);
    if (!Object.keys(command).length > 0) return;
    client.commands.push(command);
  });
});

client.login(token);

let app = require("express")();
app.get("/", (req, res) => {
  res.sendStatus(200);
});
app.listen(3000);

client.on("ready", async () => {
  console.log("I'm AWAKE")
  await client.user.setActivity("/help | إنّ بيوت الجنة تبنى بالذكر", {
    type: "LISTENING",
  });
});

////////////////////////////////////////////


client.on("ready", async () => {
    process.on("uncaughtException", async function (err) {
        console.log(err);
        /*
        let channel = client.guilds.cache
        .get("830011771880210434")
        .channels.cache.get("1010290658516414525");
        let file = Buffer.from(
            await new Blob([err.stack], { type: "text/plain" })
            .arrayBuffer()
            .catch()
        );
        channel.send({
            content: `new Error :`,
            files: [{ attachment: file, name: `err.prolog` }],
        });
      */
    });
})


const { AutoKill } = require('autokill');
 AutoKill({ Client: client, Time: 5000 });



