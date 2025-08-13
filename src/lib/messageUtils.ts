import { MessageItemModel } from "@/store/messageStore";
import { format, isToday, isYesterday, parseISO, isValid } from "date-fns";

export type MessageListItem = 
  | { type: "message"; message: MessageItemModel }
  | { type: "date-divider"; date: string; displayDate: string };

export function groupMessagesByDay(messages: MessageItemModel[]): MessageListItem[] {
  const items: MessageListItem[] = [];
  let currentDate: string | null = null;

  for (const message of messages) {
    // Parse the message time to get the date
    const messageDate = parseMessageDate(message.time);
    const messageDateString = format(messageDate, "yyyy-MM-dd");

    // Add date divider if this is a new day
    if (currentDate !== messageDateString) {
      currentDate = messageDateString;
      items.push({
        type: "date-divider",
        date: messageDateString,
        displayDate: formatDateForDivider(messageDate),
      });
    }

    // Add the message
    items.push({
      type: "message",
      message,
    });
  }

  return items;
}

function parseMessageDate(timeString: string): Date {
  // Handle different time formats
  if (timeString === "now" || timeString === "just now") {
    return new Date();
  }

  // Try to parse as ISO date first
  const isoDate = parseISO(timeString);
  if (isValid(isoDate)) {
    return isoDate;
  }

  // Handle relative time strings like "1h ago", "2d ago"
  const now = new Date();
  
  if (timeString.includes("ago")) {
    const match = timeString.match(/(\d+)([mhd])/);
    if (match) {
      const [, amount, unit] = match;
      const num = parseInt(amount, 10);
      
      switch (unit) {
        case "m":
          return new Date(now.getTime() - num * 60 * 1000);
        case "h":
          return new Date(now.getTime() - num * 60 * 60 * 1000);
        case "d":
          return new Date(now.getTime() - num * 24 * 60 * 60 * 1000);
      }
    }
  }

  // Try to parse as a date string (for the generated older messages)
  const parsed = new Date(timeString);
  if (isValid(parsed)) {
    return parsed;
  }

  // Fallback to current time
  return now;
}

function formatDateForDivider(date: Date): string {
  if (isToday(date)) {
    return "Today";
  }
  
  if (isYesterday(date)) {
    return "Yesterday";
  }

  // For older dates, show the full date
  return format(date, "EEEE, MMMM d, yyyy");
}