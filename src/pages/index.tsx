import styles from "@/styles/Home.module.css";
import { useCallback, useEffect, useState } from "react";
// Wagmi Imports
import { useAccount, useSignMessage } from "wagmi";

// W3I Imports
import {
  usePrepareRegistration,
  useRegister,
  useSubscribe,
  useSubscription,
  useUnsubscribe,
  useWeb3InboxAccount,
  useWeb3InboxClient,
} from "@web3inbox/react";
import { sendNotification } from "@/utils/fetchNotify";
import Messages from "@/components/Messages";

export default function Home() {
  // Wagmi
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  // W3I
  const { data: w3iClient, isLoading: w3iClientIsLoading } =
    useWeb3InboxClient();
  const { isRegistered } = useWeb3InboxAccount(`eip155:1:${address}`);

  // Registration
  const { prepareRegistration } = usePrepareRegistration();
  const { register, isLoading: isRegistering } = useRegister();

  //UI
  const [isSending, setIsSending] = useState(false);

  const handleRegistration = async () => {
    try {
      const { message, registerParams } = await prepareRegistration();
      const signature = await signMessageAsync({ message: message });
      await register({ registerParams, signature });
    } catch (registerIdentityError: any) {
      console.error(registerIdentityError);
    }
  };

  // Subscription
  const { subscribe, isLoading: isSubscribing } = useSubscribe();
  const { unsubscribe, isLoading: isUnsubscribing } = useUnsubscribe();
  const { data: subscription } = useSubscription();
  const isSubscribed = Boolean(subscription);

  // Handle Test Notification
  const handleTestNotification = async () => {
    if (isSubscribed) {
      setIsSending(true);
      try {
        console.log({ address });
        await sendNotification({
          accounts: [`eip155:1:${address}`],
          notification: {
            title: "GM Stable Test",
            body: "Hack it until you make it!",
            icon: `${window.location.origin}/WalletConnect-blue.svg`,
            url: window.location.origin,
            type: "805e6d86-4b35-4b9a-b81a-a2f761e0e687",
          },
        });
        setIsSending(false);
      } catch (error: any) {
        console.error("Notification Error", error);
        setIsSending(false);
      }
    }
  };

  return (
    <>
      <main className={styles.main}>
        {w3iClientIsLoading ? (
          <div
            className={styles.card}
            style={{
              textAlign: "center",
            }}
          >
            {" "}
            Loading W3I Client
          </div>
        ) : (
          <div className={styles.card}>
            <h1> W3I Stable Test</h1>
            <div className={styles.cardContainer}>
              <div className={styles.btnContainer}>
                <span>Connect Wallet</span>
                <w3m-button />
              </div>
              <div className={styles.btnContainer}>
                <span>{isRegistered ? `Registered` : `Not Registered`}</span>
                <button
                  disabled={isRegistering || isRegistered}
                  className={`${styles.btn} ${!isRegistered && styles.btnInfo}`}
                  onClick={handleRegistration}
                >
                  {isRegistered ? "Already Registered" : "Register"}
                </button>
              </div>
              <div className={styles.btnContainer}>
                <span>{isSubscribed ? `Subscribed` : `Not Subscribed`}</span>
                <button
                  disabled={isSubscribing || isUnsubscribing}
                  className={`${styles.btn} ${!isSubscribed && styles.btnInfo}`}
                  onClick={isSubscribed ? unsubscribe : subscribe}
                >
                  {isSubscribed ? "Unsubscribe" : "Subscribe"}
                </button>
              </div>
              <div className={styles.btnContainer}>
                <span>Test Notification</span>

                <button
                  disabled={(!isRegistered && !isSubscribed) || isSending}
                  className={styles.btn}
                  onClick={handleTestNotification}
                >
                  {isSending ? "Sending..." : "Test Notification"}
                </button>
              </div>
              <hr />
            </div>
            <Messages />
          </div>
        )}
      </main>
    </>
  );
}
