'use client';
export const getDaysLeftString = (t: any, daysLeft: number) => {
  if (daysLeft === 0) return t("challenge.ended");
  if (daysLeft === 1 || daysLeft > 10) return `${daysLeft} ${t("challenge.day_left")}`;
  if (daysLeft < 10) return `${daysLeft} ${t("challenge.days_left")}`;
  return "";
};
