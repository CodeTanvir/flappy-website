export const formatBDDateTime = (dateValue) => {
  if (!dateValue) return "-";

  const date = new Date(dateValue);

  return date.toLocaleString("en-BD", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};