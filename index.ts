import { RefreshingAuthProvider } from "@twurple/auth"
import { ChatClient } from "@twurple/chat"
import { promises as fs } from "fs"
import dotenv from "dotenv-flow"

dotenv.config({
  default_node_env: "development",
})

const clientId = process.env.CLIENT_ID as string
const clientSecret = process.env.CLIENT_SECRET as string
const channel = process.env.CHANNEL as string

async function main() {
  const tokenData = JSON.parse(await fs.readFile("./tokens.json", "utf-8"))
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
  )

  const chatClient = new ChatClient(auth, { channels: [channel] })
  await chatClient.connect()

  chatClient.onMessage((channel, user, message) => {
    console.log({ user, message, channel })
    // if (message === "!ping") {
    //   chatClient.say(channel, "Pong!")
    // } else if (message === "!dice") {
    //   const diceRoll = Math.floor(Math.random() * 6) + 1
    //   chatClient.say(channel, `@${user} rolled a ${diceRoll}`)
    // }
  })

  // chatClient.onSub((channel, user) => {
  //   chatClient.say(
  //     channel,
  //     `Thanks to @${user} for subscribing to the channel!`
  //   )
  // })
  // chatClient.onResub((channel, user, subInfo) => {
  //   chatClient.say(
  //     channel,
  //     `Thanks to @${user} for subscribing to the channel for a total of ${subInfo.months} months!`
  //   )
  // })
  // chatClient.onSubGift((channel, user, subInfo) => {
  //   chatClient.say(
  //     channel,
  //     `Thanks to ${subInfo.gifter} for gifting a subscription to ${user}!`
  //   )
  // })
}

main()
