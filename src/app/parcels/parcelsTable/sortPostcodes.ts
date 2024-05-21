export const sortPostcodes = (postcodes: string[]) => {
    return postcodes.sort(compare)
}

const compare = (x: string, y: string) => {
  if (x === " " && y !== " ") {
    return -1
  } else {
    return Number(x) - Number(y)
  }
}