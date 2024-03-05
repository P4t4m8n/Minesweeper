
export class Util {

    static getRandomInt(limit: number): number {
        return Math.floor(Math.random() * limit);
    }

    static deepClone<T>(obj: T): T {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        //Creates a new array and clones each element
        if (obj instanceof Array) {
            const copy = [] as any[];
            for (let i = 0, len = obj.length; i < len; i++) {
                copy[i] = Util.deepClone(obj[i]);
            }
            return copy as T;
        }

        //Creates a new object and clones each property
        if (obj instanceof Object) {
            const copy = {} as { [key: string]: any };
            for (const attr in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, attr)) {
                    copy[attr] = Util.deepClone((obj as { [key: string]: any })[attr]);
                }
            }
            return copy as T;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    }




}