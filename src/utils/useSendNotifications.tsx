import { useCallback, useState } from "react";
import { INotification } from "../utils/types";
import { sendNotification } from "../utils/fetchNotify";
import { useAccount } from "wagmi";

function useSendNotification() {
  const [isSending, setIsSending] = useState<boolean>(false);
  const { address } = useAccount();

  const handleSendNotification = useCallback(
    async (notification: INotification) => {
      if (!address) {
        return;
      }
      setIsSending(true);
      try {
        const { success } = await sendNotification({
          accounts: [`eip155:1:${address}`],
          notification,
        });
        setIsSending(false);

        console.log({ success });
      } catch (error: any) {
        setIsSending(false);
        console.error({ sendNotificationError: error });
      }
    },
    [address]
  );

  return {
    handleSendNotification,
    isSending,
  };
}

export default useSendNotification;
