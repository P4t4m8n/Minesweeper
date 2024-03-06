

export class FirebaseService {

    constructor() { }

    static async fetchData(collectionPath: string) {
        const projectId = 'mine-sweeper-766b3'
        const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/`

        try {
            const response = await fetch(`${baseUrl}${collectionPath}`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            return data
        } catch (err) {
            console.error("Error fetching data:", err);
            throw err;
        }
    }

    static async addData(path: string, data: any) {

        const projectId = 'mine-sweeper-766b3'
        const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/`

        const fetchData = {
            method: 'PUT',
            headers: {
                'Content-Type': 'score/json',
            },
            body: JSON.stringify({ fields: data }),
        }
        
        try {
            const response = await fetch(`${baseUrl}/${path}`, fetchData)

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return await response.json()

        } catch (err) { throw err }

    }

}