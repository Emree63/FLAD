"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Location_1 = require("../models/Location");
const LocationSchema_1 = __importDefault(require("../database/LocationSchema"));
class LocationService {
    constructor() {
        this.locations = LocationSchema_1.default;
    }
    getNearUser(userId, musicId, latitude, longitude) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.locations.findOneAndUpdate({ userId }, { userId, musicId, latitude, longitude }, { upsert: true });
            const snapshot = yield this.locations.find({ userId: { $ne: userId } });
            if (!snapshot.length) {
                console.log('No matching documents.');
                return;
            }
            let usersLocation = [];
            snapshot.forEach(doc => {
                usersLocation.push(new Location_1.UserLocation(doc.userId, doc.musicId, doc.latitude, doc.longitude));
            });
            const listUser = {};
            usersLocation.forEach(user => {
                const distance = this.distanceBetween(latitude, longitude, user.latitude, user.longitude);
                if (distance <= 100) {
                    listUser[user.userId] = user.musicId;
                }
            });
            return { listUser };
        });
    }
    distanceBetween(lat1, lon1, lat2, lon2) {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1 / 180;
            var radlat2 = Math.PI * lat2 / 180;
            var theta = lon1 - lon2;
            var radtheta = Math.PI * theta / 180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            dist = dist * 1.609344;
            return dist;
        }
    }
}
exports.default = LocationService;
//# sourceMappingURL=LocationService.js.map