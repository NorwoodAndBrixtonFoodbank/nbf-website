const getCurrentYear = (): number => {
    const currentDate = new Date();
    return currentDate.getFullYear();
};

export const getChildBirthYears = (): string[] => {
    const currentYear = getCurrentYear();
    const childBirthYears: string[] = Array.from({ length: 17 }, (_, index) => {
        return (currentYear - index).toString();
    });
    return childBirthYears;
};

export const getAdultBirthYears = (): string[] => {
    const currentYear = getCurrentYear();
    const adultBirthYears: string[] = Array.from({ length: 120 }, (_, index) => {
        return (currentYear - index - 16).toString();
    });
    return adultBirthYears;
};

export const youngestAdultBirthYear = getAdultBirthYears()[0];

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
