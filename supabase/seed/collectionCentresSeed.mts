const collectionCentreTimeSlots = [
    "10:00:00",
    "10:15:00",
    "10:30:00",
    "10:45:00",
    "11:00:00",
    "11:15:00",
    "11:30:00",
    "11:45:00",
    "12:00:00",
    "12:15:00",
    "12:30:00",
    "12:45:00",
    "13:00:00",
    "13:15:00",
    "13:30:00",
    "13:45:00",
    "14:00:00",
]

export const collectionCentres = [
    {
        name: "Brixton Hill - Methodist Church",
        acronym: "BH-MC",
        isDelivery: false,
        activeTimeSlot: collectionCentreTimeSlots,
    },
    {
        name: "Clapham - St Stephens Church",
        acronym: "CLP-SC",
        isDelivery: false,
        activeTimeSlot: collectionCentreTimeSlots,
    },
    {
        name: "Delivery",
        acronym: "DLVR",
        isDelivery: true,
        activeTimeSlot: collectionCentreTimeSlots,
    },
];

