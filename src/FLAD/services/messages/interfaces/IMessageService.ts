import Conversation from "../../../models/Conversation";
import Message from "../../../models/Message";

export default interface IMessageService {
    getConversations(): Promise<Conversation[]>;
    getMessagesWithIdConversation(id: string): Promise<Message[]>;
    sendMessage(id: string, mes: Message): Promise<void>;
}