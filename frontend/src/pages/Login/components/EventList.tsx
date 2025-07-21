import { useState } from "react";
import styles from "./EventList.module.scss";

const EventList = () => {
    const [events, setEvents] = useState<Event[]>([]);

    return (
        <div className={styles.container}>
            <h2>Мероприятия</h2>
            {events.map((event) => (
                <Event key={event.id} event={event}></Event>
            ))}
        </div>
    )
}