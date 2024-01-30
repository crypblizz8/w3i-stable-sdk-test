import styles from "@/styles/Home.module.css";
import { useCallback, useEffect } from "react";
// Wagmi Imports
import { useAccount, useSignMessage } from "wagmi";

// W3I Imports
import {
  useNotifications,
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

const notificationsPerPage = 5;
const isInfiniteScroll = true;

export default function Home() {
  // Wagmi
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  // W3I
  const { data: w3iClient, isLoading: w3iClientIsLoading } =
    useWeb3InboxClient();
  const { isRegistered, setAccount } = useWeb3InboxAccount(address);

  useEffect(() => {
    if (!address || !w3iClient) return;
    setAccount(`eip155:1:${address}`);
  }, [w3iClient, address, setAccount]);

  // Registration
  const { prepareRegistration } = usePrepareRegistration();
  const { register, isLoading: isRegistering } = useRegister();

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
      } catch (error: any) {
        console.error("Notification Error", error);
      }
    }
  };

  // Get Notifications
  const { data: notificationsData } = useNotifications(
    notificationsPerPage,
    isInfiniteScroll
  );

  return (
    <>
      <main className={styles.main}>
        {w3iClientIsLoading ? (
          <div> Loading W3I Client</div>
        ) : (
          <div>
            <h1> W3I Stable Test</h1>
            <w3m-button />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <button
                className={styles.blueButton}
                onClick={handleRegistration}
              >
                {isRegistered ? "Registered" : "Register"}
              </button>
              <button className={styles.blueButton} onClick={subscribe}>
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </button>
              <button
                className={styles.blueButton}
                onClick={handleTestNotification}
              >
                Test Notification
              </button>
              <Messages />
            </div>
          </div>
        )}
      </main>
    </>
  );
}
