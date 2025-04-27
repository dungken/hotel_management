import { format, isValid } from "date-fns";

export const formatDate = (date: string | Date | undefined | null): string => {
  if (!date) return "N/A";
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (!isValid(dateObj)) {
    console.warn(`Invalid date: ${date}`);
    return "Invalid date";
  }
  
  return format(dateObj, "MMM dd, yyyy");
};

export const formatDateTime = (date: string | Date | undefined | null): string => {
  if (!date) return "N/A";
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (!isValid(dateObj)) {
    console.warn(`Invalid date: ${date}`);
    return "Invalid date";
  }
  
  return format(dateObj, "MMM dd, yyyy HH:mm");
};

export const formatTime = (date: string | Date | undefined | null): string => {
  if (!date) return "N/A";
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (!isValid(dateObj)) {
    console.warn(`Invalid date: ${date}`);
    return "Invalid time";
  }
  
  return format(dateObj, "HH:mm");
};

export const isDateValid = (date: string | Date | undefined | null): boolean => {
  if (!date) return false;
  
  const dateObj = date instanceof Date ? date : new Date(date);
  return isValid(dateObj);
};
