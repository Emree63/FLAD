import Message from "../../models/Message";
import IMessageService from "../../services/messages/interfaces/IMessageService"
import StubMessageService from "../../services/messages/stub/StubMessageService";
import { setConversations, setMessages } from "../actions/appActions";

const chatService: IMessageService = new StubMessageService();

export const getConversations = () => {
  //@ts-ignore
  return async dispatch => {
    try {
      const conversations = await chatService.getConversations();
      dispatch(setConversations(conversations));
    } catch (error: any) {

    }
  }
}

export const getMessages = (id: string) => {
  //@ts-ignore
  return async dispatch => {
    try {
      const messages = await chatService.getMessagesWithIdConversation(id);
      dispatch(setMessages(messages));
    } catch (error: any) {

    }
  }
}

export const sendMessage = (id: string, message: Message) => {
  //@ts-ignore
  return async dispatch => {
    try {
      await chatService.sendMessage(id, message);
      dispatch(getMessages(id));
    } catch (error: any) {

    }
  }
}