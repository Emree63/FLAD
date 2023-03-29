import { AuthentificationService } from "../Auth/authentificationService.service";

export class UserService {

	constructor(private auth: AuthentificationService) { }

	getUserProfile() {
		const user = this.auth.currentUser;
		const userDocRef = doc(this.firestore, `User/${user.uid}`);
		return docData(userDocRef);
	}

}
