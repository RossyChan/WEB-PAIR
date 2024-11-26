const express = require('express');
const fs = require('fs');
const { exec } = require("child_process");
let router = express.Router()
const pino = require("pino");
const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers,
    jidNormalizedUser
} = require("@whiskeysockets/baileys");
const { upload } = require('./mega');

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    let num = req.query.number;
    async function PairPinkVenom() {
        const { state, saveCreds } = await useMultiFileAuthState(`./session`);
        try {
            let conn = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                browser: Browsers.macOS("Safari"),
            });

            if (!conn.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await conn.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            conn.ev.on('creds.update', saveCreds);
            conn.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;
                if (connection === "open") {
                    try {
                        await delay(4000);
                        const sessionPrabath = fs.readFileSync('./session/creds.json');

                        const auth_path = './session/';
                        const user_jid = jidNormalizedUser(conn.user.id);

                      function randomMegaId(length = 6, numberLength = 4) {
                      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                      let result = '';
                      for (let i = 0; i < length; i++) {
                      result += characters.charAt(Math.floor(Math.random() * characters.length));
                        }
                       const number = Math.floor(Math.random() * Math.pow(10, numberLength));
                        return `${result}${number}`;
                        }
                        let desc = `
*𝙳𝚘𝚗𝚝 𝚜𝚑𝚊𝚛𝚎 𝚝𝚑𝚒𝚜 𝚌𝚘𝚍𝚎 𝚠𝚒𝚝𝚑 𝚊𝚗𝚢𝚘𝚗𝚎!! 
𝚄𝚜𝚎 𝚝𝚑𝚒𝚜 𝚌𝚘𝚍𝚎 𝚝𝚘 𝚌𝚛𝚎𝚊𝚝𝚎 𝙿𝚒𝚗𝚔𝚅𝚎𝚗𝚘𝚖-𝙼𝙳 𝚆𝚑𝚊𝚝𝚜𝚊𝚙𝚙 𝚄𝚜𝚎𝚛 𝚋𝚘𝚝.*
                        
◦ *Github:* https://github.com/ayooh-me/Pink-Venom-MD
◦ Thank You For Choosing Pink Venom-MD Whatsapp User Bot..
  
*ᴘɪɴᴋ-ᴠᴇɴᴏᴍ ᴍᴅ ᴡʜᴀᴛꜱᴀᴘᴘ ᴜꜱᴇʀ ʙᴏᴛ*
*ᴄʀᴇᴀᴛᴇᴅ ʙʏ • ᴀʏᴏᴅʏᴀ ᴠɪᴄʜᴀᴋsʜᴀɴᴀ*`;

                        const mega_url = await upload(fs.createReadStream(auth_path + 'creds.json'), `${randomMegaId()}.json`);

                        const string_session = mega_url.replace('https://mega.nz/file/', '');

                        const sid = "PINKVENOM-MD;" + string_session;

                        const dt = await conn.sendMessage(user_jid, {
                            text: sid
                        });
                        await conn.sendMessage(config.OWNER + "@s.whatsapp.net", {
                          image: { url: `https://i.ibb.co/gZvXk58/6745cd80781fc.jpg` },caption: desc },{quoted: ddd })

                    } catch (e) {
                        exec('npm restart');
                    }

                    await delay(100);
                    return await removeFile('./session');
                    process.exit(0);
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode !== 401) {
                    await delay(10000);
                    PairPinkVenom();
                }
            });
        } catch (err) {
            exec('npm restart');
            console.log(err);
            PairPinkVenom();
            await removeFile('./session');
            if (!res.headersSent) {
                await res.send({ code: "Service Unavailable" });
            }
        }
    }
    return await PairPinkVenom();
});

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
    exec('npm restart');
});


module.exports = router;
