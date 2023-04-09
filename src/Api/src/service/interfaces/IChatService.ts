interface IChatService {
	sendMessage() : Promise<any>;
    getHistory() : Promise<any>;// pagination
    createConverssation () :Promise<boolean>;
}
