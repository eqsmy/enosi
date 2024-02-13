import { trackEvent as aptabaseTrackEvent } from "@aptabase/react-native";

/**
 * Tracks an event with optional properties.
 * @param {string} eventName The name of the event to track.
 * @param {object} properties Optional properties to associate with the event.
 */
export const trackEvent = (eventName, properties = {}) => {
  aptabaseTrackEvent(eventName, properties);
};
