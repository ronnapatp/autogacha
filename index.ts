import { RefreshingAuthProvider } from "@twurple/auth";
import { ChatClient } from "@twurple/chat";
import { promises as fs } from "fs";
import dotenv from "dotenv-flow";
import axios from 'axios'

dotenv.config({
  default_node_env: "development",
});

const investIntervalMs = 303000;
const farmIntervalMs = 301000;
const stopTime = 2 * 60 * 60 * 1000;
let running = true;

const clientId = process.env.CLIENT_ID as string;
const clientSecret = process.env.CLIENT_SECRET as string;
const channel = process.env.CHANNEL as string;
const invest = `!invest narzelAmogus`;
const message = `!farm`;

axios.get('https://tmi.twitch.tv/group/user/narzelive/chatters')
  .then(function (response) {
    const broadcaster = response.data.chatters.broadcaster
    if( broadcaster !== `["narzeLive"]` ){
      running = false
    } else {
      running = true
    }
});

async function main() {
  setTimeout(() => {
    console.log("Stopped");
    running = false;
  }, stopTime);

  const tokenData = JSON.parse(await fs.readFile("./tokens.json", "utf-8"));
  const auth = new RefreshingAuthProvider(
    {
      clientId,
      clientSecret,
      onRefresh: async (newTokenData) =>
        await fs.writeFile(
          "./tokens.json",
          JSON.stringify(newTokenData, null, 2),
          "utf-8"
        ),
    },
    tokenData
  );

  const chatClient = new ChatClient(auth, { channels: [channel] });
  chatClient.onConnect(async () => {
    console.log("CONNECTED", { channel });

    setInterval(async () => {
      if (!running) {
        return;
      }

      await chatClient.say(channel, invest).then(
        () => {
          console.log("Sent", { invest });
        },
        (reason) => {
          console.error("Not sent", { reason });
        }
      );
    }, investIntervalMs);

    setInterval(async () => {
      if (!running) {
        return;
      }

      await chatClient.say(channel, message).then(
        () => {
          console.log("Sent", { message });
        },
        (reason) => {
          console.error("Not sent", { reason });
        }
      );
    }, farmIntervalMs);
  });

  await chatClient.connect();
}

main();
