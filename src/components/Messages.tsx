import { useNotificationTypes, useNotifications } from "@web3inbox/react";
import React from "react";

function Messages() {
  const { data: notifications } = useNotifications(3, false);
  const { data: notificationTypes } = useNotificationTypes();

  return (
    <div>
      <h2>Previous Messages</h2>
      {!notifications?.length ? (
        <p>No messages yet.</p>
      ) : (
        notifications.map(({ id, ...message }) => (
          <div
            key={id}
            style={{
              borderRadius: "16px",
              border: "1px solid grey",
              padding: "8px",
              margin: "8px",
            }}
          >
            <h3>{message.title}</h3>
            <p>{message.body}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Messages;
