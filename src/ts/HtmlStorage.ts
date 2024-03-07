
export class HtmlStorage {

    static getMarkedSvg(): string {
        return (
            `<svg  viewBox="0 0 24 24" ><g  stroke-width="0"></g><g stroke-linecap="round" stroke-linejoin="round"></g><g> <path d="M5 21V3.90002C5 3.90002 5.875 3 8.5 3C11.125 3 12.875 4.8 15.5 4.8C18.125 4.8 19 3.9 19 3.9V14.7C19 14.7 18.125 15.6 15.5 15.6C12.875 15.6 11.125 13.8 8.5 13.8C5.875 13.8 5 14.7 5 14.7" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`
        )
    }

    static getSmileySvg(): string {
        return (
            `<svg class="restart-svg" viewBox="0 0 24 16" preserveAspectRatio="xMinYMin" class="jam jam-smiley">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
        <path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-3.92-4.606a1 1 0 1 1 1.84-.788 2.264 2.264 0 0 0 4.16 0 1 1 0 1 1 1.84.788 4.264 4.264 0 0 1-7.84 0zM7 6a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1zm6 0a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0V7a1 1 0 0 1 1-1z"></path></g>
        </svg>`
        )
    }

   static getWorriedSmiley(): string {
        return (
            `<svg class="restart-svg" viewBox="0 0 256 220" >
            <g id="SVGRepo_bgCarrier" ></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier"> <path d="M76,108a16,16,0,1,1,16,16A16.00016,16.00016,0,0,1,76,108Zm88-16a16,16,0,1,0,16,16A16.00016,16.00016,0,0,0,164,92Zm72,36A108,108,0,1,1,128,20,108.12217,108.12217,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.0953,84.0953,0,0,0,212,128Zm-44,20H88a12,12,0,0,0,0,24h80a12,12,0,0,0,0-24Z"></path> </g>
            </svg>`
        )
    }

    static getSadSmileySvg(): string {
        return (
            `<svg  viewBox="0 0 256 220" >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier"> <path d="M128,20A108,108,0,1,0,236,128,108.12186,108.12186,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09562,84.09562,0,0,1,128,212ZM76,108a16,16,0,1,1,16,16A16.00016,16.00016,0,0,1,76,108Zm104,0a16,16,0,1,1-16-16A16.00016,16.00016,0,0,1,180,108Zm-5.41113,54.18652a12,12,0,1,1-18.62793,15.13282,36.0032,36.0032,0,0,0-55.92237.001A12.0002,12.0002,0,1,1,81.41016,162.1875a60.0038,60.0038,0,0,1,93.17871-.001Z"></path> </g>
            </svg>`
        )
    }

    static getHappySMileySvg(): string {
        return (
            `  <svg class="restart-svg" viewBox="0 0 128 90">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier"> <g> <path d="M90.547,15.518C69.859-5.172,36.199-5.172,15.515,15.513C-5.172,36.198-5.17,69.858,15.517,90.547 c20.682,20.684,54.342,20.684,75.028-0.004C111.23,69.858,111.228,36.2,90.547,15.518z M84.758,84.758 c-17.494,17.494-45.961,17.496-63.456,0.002c-17.498-17.497-17.496-45.966,0-63.46C38.797,3.807,67.262,3.805,84.76,21.302 C102.254,38.796,102.252,67.265,84.758,84.758z M33.24,38.671c0-3.424,2.777-6.201,6.201-6.201c3.422,0,6.199,2.776,6.199,6.201 c0,3.426-2.777,6.202-6.199,6.202C36.017,44.873,33.24,42.097,33.24,38.671z M61.357,38.671c0-3.424,2.779-6.201,6.203-6.201 s6.201,2.776,6.201,6.201c0,3.426-2.777,6.202-6.201,6.202S61.357,42.097,61.357,38.671z M76.017,62.068 c-2.512,5.805-7.23,10.254-13.006,12.652v3.94c0,5.295-4.471,9.587-9.982,9.587c-5.511,0-9.98-4.292-9.98-9.587v-3.932 c-5.863-2.405-10.594-6.885-13.023-12.734c-0.637-1.529,0.09-3.285,1.619-3.921c0.377-0.155,0.766-0.229,1.15-0.229 c1.176,0,2.291,0.695,2.771,1.85c2.777,6.686,9.654,11.004,17.523,11.004c7.689,0,14.527-4.321,17.42-11.011 c0.658-1.521,2.424-2.222,3.944-1.563C75.974,58.781,76.675,60.548,76.017,62.068z"></path> </g> </g>
            </svg>`
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