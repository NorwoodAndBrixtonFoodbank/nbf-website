const currentDate = new Date();
const currentYear = currentDate.getFullYear();

const childBirthYears: string[] = Array.from({ length: 17 }, (_, index) => {
    return (currentYear - index).toString();
});

export const childBirthYearList: [string, string][] = childBirthYears.map((year) => {
    return [`${year}`, `${year}`];
});

export const adultBirthYearList: string[] = Array.from({ length: 120 }, (_, index) => {
    return (currentYear - index - 16).toString();
});

const monthsOfTheYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export const childBirthMonthList: [string, string][] = monthsOfTheYear.map((month, index) => {
    return [month, (index + 1).toString()];
});
