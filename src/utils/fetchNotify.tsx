import { INotification } from "./types";

export const sendNotification = async (notificationPayload: {
  accounts: string[];
  notification: INotification;
}) => {
  const result = await fetch("/api/notify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(notificationPayload),
  });

  const gmRes = await result.json();
  const { success, message } = gmRes;

  return { success, message };
};
