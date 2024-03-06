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
            try {
                const response = yield fetch(`${baseUrl}${collectionPath}`);
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
    static addData(path, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const projectId = 'mine-sweeper-766b3';
            const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/`;
            const fetchData = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'score/json',
                },
                body: JSON.stringify({ fields: data }),
            };
            try {
                const response = yield fetch(`${baseUrl}/${path}`, fetchData);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return yield response.json();
            }
            catch (err) {
                throw err;
            }
        });
    }
}
