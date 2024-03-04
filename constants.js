import InterRegular from "./assets/fonts/Inter-Regular.ttf";
import InterMedium from "./assets/fonts/Inter-Medium.ttf";
import InterBold from "./assets/fonts/Inter-Bold.ttf";
import OdorMeanChey from "./assets/fonts/OdorMeanChey-Regular.ttf";

export const COLORS = {
  primary: "#5D8916",
  secondary: "#6C4100",
  lightprimary: "#70B600",
  accent: "#C69ED4",
  lightaccent: "#F8E6FF",
  defaultgray: "#A1A99E",
  lightgrey: "#E8E8E8",
  white: "#FFFFFF",
};

export const FONTS = {
  header: "OdorMeanChey-Regular",
  body: "Inter-Regular",
  medium: "Inter-Medium",
  bold: "Inter-Bold",
};

export const FONT_SOURCE_HEADER = OdorMeanChey;
export const FONT_SOURCE_BODY = InterRegular;
export const FONT_SOURCE_MEDIUM = InterMedium;
export const FONT_SOURCE_BOLD = InterBold;

export const timeAgo = (timestamp) => {
  timestamp = new Date(timestamp).getTime();
  const now = Date.now();
  const seconds = Math.floor((now - timestamp) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return `${interval} years ago`;
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return `${interval} months ago`;
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return `${interval} days ago`;
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return `${interval} hours ago`;
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return `${interval} minutes ago`;
  }
  return `${Math.floor(seconds)} seconds ago`;
};
