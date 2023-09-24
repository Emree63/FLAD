"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Location = exports.UserLocation = void 0;
const mongoose_1 = require("mongoose");
class UserLocation {
    constructor(userId, musicId, latitude, longitude) {
        this.userId = userId;
        this.musicId = musicId;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
exports.UserLocation = UserLocation;
class Location extends mongoose_1.Document {
}
exports.Location = Location;
//# sourceMappingURL=Location.js.map