

export class FirebaseService {

    constructor() { }

    static async fetchData(collectionPath: string) {
        const projectId = 'mine-sweeper-766b3'
        const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/`
        const orderBy = '?orderBy=time desc'

        try {
            const response = await fetch(`${baseUrl}${collectionPath}${orderBy}`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            return data
        } catch (err) {
            console.error("Error fetching data:", err)
            throw err
        }
    }

    static async postData(collectionPath: string, data: any) {
    console.log("data:", data)

        const projectId = 'mine-sweeper-766b3'
        const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/`
        const newData = {
            fields: {
                name: { stringValue: data.name },
                time: { doubleValue: data.time }
            }
        }

        const fetchData = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
        }

        try {
            const response = await fetch(`${baseUrl}${collectionPath}`, fetchData)

            if (!response.ok) {
                const errorBody = await response.text()
                console.error(`HTTP error! Status: ${response.status}, Body: ${errorBody}`)
                throw new Error(`HTTP error! Status: ${response.status}`)
            }

            return await response.json()
        } catch (err) {
            console.error("Error in postData:", err)
            throw err
        }


    }

}