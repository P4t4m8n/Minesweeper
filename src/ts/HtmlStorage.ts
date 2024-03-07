
export class HtmlStorage {

    static getMarkedSvg(): string {
        return (
            `<svg viewBox="0 0 24 24" ><g  stroke-width="0"></g><g stroke-linecap="round" stroke-linejoin="round"></g><g> <path d="M5 21V3.90002C5 3.90002 5.875 3 8.5 3C11.125 3 12.875 4.8 15.5 4.8C18.125 4.8 19 3.9 19 3.9V14.7C19 14.7 18.125 15.6 15.5 15.6C12.875 15.6 11.125 13.8 8.5 13.8C5.875 13.8 5 14.7 5 14.7" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`
        )
    }

    static getSmileyImg(): string {
        return (
            `<img class="restart-img" src="https://res.cloudinary.com/dpnevk8db/image/upload/v1709832876/icons8-happy-smiley-48_qqleaa.png">`
        )
    }

    static getGameSmileyImg(): string {
        return (
            `<img class="restart-img" src="https://res.cloudinary.com/dpnevk8db/image/upload/v1709832876/icons8-tongue-out-48_gzxiod.png">`

        )
    }

    static getSadSmileyImg(): string {
        return (
            `<img class="restart-img" src="https://res.cloudinary.com/dpnevk8db/image/upload/v1709832876/icons8-sad-48_yywbuu.png">`

        )
    }

    static getHappySMileyImg(): string {
        return (
            `<img class="restart-img" src="https://res.cloudinary.com/dpnevk8db/image/upload/v1709832876/icons8-cool-48_urbgkm.png">`

        )
    }

    static getLightBulbSvg(idx = ''): string {
        return (
            `<svg class=hint hint${idx} viewBox="0 0 24 24" >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier"> <path d="M10.063 8.5C10.0219 8.34019 10 8.17265 10 8C10 6.89543 10.8954 6 12 6C12.1413 6 12.2792 6.01466 12.4122 6.04253M5.6 21H18.4C18.9601 21 19.2401 21 19.454 20.891C19.6422 20.7951 19.7951 20.6422 19.891 20.454C20 20.2401 20 19.9601 20 19.4V18.6C20 18.0399 20 17.7599 19.891 17.546C19.7951 17.3578 19.6422 17.2049 19.454 17.109C19.2401 17 18.9601 17 18.4 17H5.6C5.03995 17 4.75992 17 4.54601 17.109C4.35785 17.2049 4.20487 17.3578 4.10899 17.546C4 17.7599 4 18.0399 4 18.6V19.4C4 19.9601 4 20.2401 4.10899 20.454C4.20487 20.6422 4.35785 20.7951 4.54601 20.891C4.75992 21 5.03995 21 5.6 21ZM17 14V8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8V14H17Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g>
            </svg>`
        )
    }

    static getLightBulbActiveSvg(): string {
        return (
            `<svg class=hint viewBox="0 0 24 24" >
            <g id="SVGRepo_bgCarrier" stroke-width="0">
            </g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier"> <path fill="yellow" d="M10.063 8.5C10.0219 8.34019 10 8.17265 10 8C10 6.89543 10.8954 6 12 6C12.1413 6 12.2792 6.01466 12.4122 6.04253M5 4L3 3M19 4L21 3M4 10H3M21 10H20M5.6 21H18.4C18.9601 21 19.2401 21 19.454 20.891C19.6422 20.7951 19.7951 20.6422 19.891 20.454C20 20.2401 20 19.9601 20 19.4V18.6C20 18.0399 20 17.7599 19.891 17.546C19.7951 17.3578 19.6422 17.2049 19.454 17.109C19.2401 17 18.9601 17 18.4 17H5.6C5.03995 17 4.75992 17 4.54601 17.109C4.35785 17.2049 4.20487 17.3578 4.10899 17.546C4 17.7599 4 18.0399 4 18.6V19.4C4 19.9601 4 20.2401 4.10899 20.454C4.20487 20.6422 4.35785 20.7951 4.54601 20.891C4.75992 21 5.03995 21 5.6 21ZM17 14V8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8V14H17Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g>
            </svg>`
        )
    }

    static getHintsHtml(amount: Number): string {
        return (
            `${amount} Remines`
        )
    }
}