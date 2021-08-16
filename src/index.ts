import axios from "axios";
import { IResultProps } from "./@types";
import { asyncLog, getErrorMessage } from "./util";

const TELEGRAM_BASE_URL = `https://api.telegram.org`;

export default class TelegramBot {
  private chatId: string;
  private lastMessageUpdateId: number | null = null;
  private getUPdatesUrl: string;
  private sendMessageUrl: string;
  private deleteMessageUrl: string;

  constructor(teletramToken: string, chatId: string) {
    this.getUPdatesUrl = `${TELEGRAM_BASE_URL}/bot${teletramToken}/getUpdates`;
    this.sendMessageUrl = `${TELEGRAM_BASE_URL}/bot${teletramToken}/sendMessage`;
    this.deleteMessageUrl = `${TELEGRAM_BASE_URL}/bot${teletramToken}/deleteMessage`;

    this.chatId = chatId;
    (async () => {
      this.lastMessageUpdateId = await this.getInitLastUpdateId();
      await asyncLog(this.lastMessageUpdateId);
    })();
  }

  getLastUpdateId() {
    return this.lastMessageUpdateId;
  }

  setLastUpdateId(updateId: number) {
    if (!this.lastMessageUpdateId || this.lastMessageUpdateId < updateId)
      this.lastMessageUpdateId = updateId;
  }

  /**
   * 최초 채팅방 마지막 메시지번호 가져오기
   */
  async getInitLastUpdateId() {
    try {
      const res: {
        data: { ok: boolean; result: IResultProps[] };
      } = await axios.get(this.getUPdatesUrl);
      const {
        data: { ok, result },
      } = res;
      if (ok) {
        // console.log(result);
        if (result.length > 0) {
          return result[result.length - 1].update_id;
        }
        return null;
      }
      return null;
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      await asyncLog(errorMsg);
      throw err;
    }
  }

  /**
   * 채팅방 메시지 받아오기
   */
  async getUpdates() {
    try {
      // console.log(this.lastMessageUpdateId);
      let url = this.getUPdatesUrl;
      if (this.lastMessageUpdateId) {
        url = `${this.getUPdatesUrl}?offset=${this.lastMessageUpdateId + 1}`;
      }
      const res: {
        data: { ok: boolean; result: IResultProps[] };
      } = await axios.get(url);
      const {
        data: { ok, result },
      } = res;
      // console.log(result);
      if (ok) {
        await asyncLog(result);
        return result;
      }
      return null;
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      await asyncLog(errorMsg);
    }
  }

  /**
   * 메시지 보내기
   * @param message: string
   */
  async sendMessage(message: string) {
    try {
      await axios.post(this.sendMessageUrl, {
        chat_id: this.chatId,
        text: message,
        parse_mode: "markdown",
      });
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      await asyncLog(errorMsg);
    }
  }

  /**
   * inline button 메시지 보내기
   * @param message: string
   * @param inlineButton: string
   */
  async sendinlineButtonMessage(message: string, inlineButton: string) {
    try {
      await axios.post(this.sendMessageUrl, {
        chat_id: this.chatId,
        text: message,
        parse_mode: "MarkDown",
        reply_markup: inlineButton,
      });
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      await asyncLog(errorMsg);
    }
  }

  /**
   * 메시지 삭제하기
   * @param messageId: number
   */
  async deleteMessage(messageId: number) {
    try {
      await axios.post(this.deleteMessageUrl, {
        chat_id: this.chatId,
        message_id: messageId,
      });
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      await asyncLog(errorMsg);
    }
  }
}
