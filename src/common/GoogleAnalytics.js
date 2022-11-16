import { Analytics, Event, PageHit } from 'expo-analytics';

const analytics = new Analytics("UA-141281472-1"); // change with your google analytics ID

//press navigation screen
const strack = screen => analytics.hit(new PageHit(screen));

const strackEvent = (eventCategory, eventAction, eventLabel, eventValue) => analytics.event(new Event(eventCategory, eventAction, eventLabel, eventValue));

export default {
    strack,
    strackEvent
}
//


