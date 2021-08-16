import "dotenv/config";
import TelegramApi from "node-telegram-api";

const TELEGRAM_TOKEN = <string>process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = <string>process.env.TELEGRAM_CHAT_ID;
// const telegramBot = new TelegramBot(TELEGRAM_TOKEN, TELEGRAM_CHAT_ID);

const candleButton = () => {
  const inline_button = JSON.stringify({
    inline_keyboard: [
      [
        { text: "1분", callback_data: "1" },
        { text: "3분", callback_data: "3" },
        { text: "5분", callback_data: "5" },
      ],
      [
        { text: "10분", callback_data: "10" },
        { text: "15분", callback_data: "15" },
        { text: "30분", callback_data: "30" },
      ],
      [
        { text: "60분", callback_data: "60" },
        { text: "240분", callback_data: "240" },
        { text: "일", callback_data: "일" },
      ],
    ],
  });
  return inline_button;
};

(async () => {
  // const test = await telegramBot.getUpdates();
  // console.log(test);
  try {
    const telegramApi = new TelegramApi(TELEGRAM_TOKEN, TELEGRAM_CHAT_ID);

    while (true) {
      const tt = await telegramApi.getUpdates();
      // console.log(tt);
      await telegramApi.asyncLog(tt);
      // if (tt) {
      //   const lastMessageId = telegramApi.getLastUpdateMessageId2(tt);
      //   lastMessageId && telegramApi.setLastMessageId(lastMessageId);
      // }
      // await sleep(1000);
      // await telegramApi.sendMessage("test");
      // await telegramApi.sendinlineButtonMessage("test2", candleButton());

      await telegramApi.sleep(1000);
    }
  } catch (err) {
    console.log(err);
  }
})();
