interface ScreenSizes {
    name: string,
    resolution: [number, number],
}

const SCREEN_SIZES: ScreenSizes[] = [
    { name: "Mobile", resolution: [360, 760] },
    { name: "Desktop", resolution: [1366, 768] }
]

export default SCREEN_SIZES;
