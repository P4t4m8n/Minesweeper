export class Util {
    static getRandomInt(limit) {
        return Math.floor(Math.random() * limit);
    }
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        //Creates a new array and clones each element
        if (obj instanceof Array) {
            const copy = [];
            for (let i = 0, len = obj.length; i < len; i++) {
                copy[i] = Util.deepClone(obj[i]);
            }
            return copy;
        }
        //Creates a new object and clones each property
        if (obj instanceof Object) {
            const copy = {};
            for (const attr in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, attr)) {
                    copy[attr] = Util.deepClone(obj[attr]);
                }
            }
            return copy;
        }
        throw new Error("Unable to copy obj! Its type isn't supported.");
    }
}
