import { useNotifications } from "@web3inbox/react";
import React from "react";
import styles from "@/styles/Messages.module.css";

function Messages() {
  const { data: notifications } = useNotifications(3, false);

  return (
    <div>
      <h2 className={styles.heading}>Previous Messages</h2>
      <div className={styles.messageContainer}>
        {!notifications?.length ? (
          <p className={styles.fallbackText}>No messages yet.</p>
        ) : (
          notifications.map(({ id, ...message }) => (
            <div key={id} className={styles.message}>
              <h3>{message.title}</h3>
              <p>{message.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Messages;
