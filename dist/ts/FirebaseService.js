var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class FirebaseService {
    constructor() { }
    static fetchData(collectionPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const projectId = 'mine-sweeper-766b3';
            const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/`;
            const orderBy = '?orderBy=time';
            const limit = '&pageSize=5';
            try {
                const response = yield fetch(`${baseUrl}${collectionPath}${orderBy}${limit}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = yield response.json();
                return data;
            }
            catch (err) {
                console.error("Error fetching data:", err);
                throw err;
            }
        });
    }
    static postData(collectionPath, data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("data:", data);
            const projectId = 'mine-sweeper-766b3';
            const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/`;
            const newData = {
                fields: {
                    name: { stringValue: data.name },
                    time: { doubleValue: data.time }
                }
            };
            const fetchData = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData),
            };
            try {
                const response = yield fetch(`${baseUrl}${collectionPath}`, fetchData);
                if (!response.ok) {
                    const errorBody = yield response.text();
                    console.error(`HTTP error! Status: ${response.status}, Body: ${errorBody}`);
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return yield response.json();
            }
            catch (err) {
                console.error("Error in postData:", err);
                throw err;
            }
        });
    }
}
