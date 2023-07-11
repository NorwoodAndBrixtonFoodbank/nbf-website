// "use client"

// import FullCalendar from "@fullcalendar/react";
// import interactionPlugin from "@fullcalendar/interaction";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import { useState } from "react";
// import React from "react";

// export interface Event {
//     // TODO: consider using Resources -> but this requires premium. Maybe can do manually.
//     id: string; // TODO: needs to be unique - perhaps username + timestamp? counter? needs to be stable;
//     title: string;
//     start?: string;
//     end?: string; // exclusive, and defaults to 00:00:00 if only date and no time specified
//     daysOfWeek?: number[];
//     startRecur?: string;
//     endRecur?: string;

//     // styling
//     // TODO: implement so that styling can be grouped (e.g. dependent on the region or organisation)
//     backgroundColor?: string;
//     borderColor?: string;
//     textColor?: string;
// }

// interface STOPTHEPAIN {
//     // TODO: consider using Resources -> but this requires premium. Maybe can do manually.
//     id: string; // TODO: needs to be unique - perhaps username + timestamp? counter? needs to be stable;
//     title: string;
//     start: Date | null;
//     end?: Date | null; // exclusive, and defaults to 00:00:00 if only date and no time specified
//     daysOfWeek?: number[];
//     startRecur?: string;
//     endRecur?: string;

//     // styling
//     // TODO: implement so that styling can be grouped (e.g. dependent on the region or organisation)
//     backgroundColor?: string;
//     borderColor?: string;
//     textColor?: string;
// }

// interface Props {
//     events?: Event[],
// };

// let counter = 0;

// const CalendarComponent: React.FC<Props> = ({ events: initialEvents }) => {
    
//     const [events, setEvents] = useState<Event[]>([]);

//     // Use react-modal for a modal dialog
    
//     function handleEvents(events: STOPTHEPAIN[]) {
//         const newEvents = events.map<Event>((e) => {
//             return {
//                id: e.id,
//                title: e.title,
//                start: e.start?.toISOString(), 
//                end: e.end?.toISOString() ,
//             };
//         });
//         setEvents(newEvents);
//     }

//     function handleEventClick() {
//         console.log("hi")
//     }

//     const calendar =
//         <FullCalendar
//             plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//             headerToolbar={{
//             left: 'prev,next today',
//             center: 'title',
//             right: 'dayGridMonth,timeGridWeek,timeGridDay'
//             }}
//             initialView='timeGridWeek'
//             editable={true}
//             selectable={true}
//             selectMirror={true}
//             dayMaxEvents={true}
//             events={events}
//             eventAdd={() => console.log("Add")}
//             select={(e) => {
//                 const newEvent = {
//                     id: `${counter++}`,
//                     title: "Whaddup",
//                     end: e.end,
//                     start: e.start,
//                 };
//                 console.log(JSON.stringify(newEvent));
//                 setEvents(
//                     [...events, newEvent]
//                 );
//             }}
//             eventClick={handleEventClick}
//             eventsSet={handleEvents}
//           />;

//     return calendar;
// };

// export default CalendarComponent;