import { useState, useCallback, useEffect } from "react";
import { includes, union } from "lodash";

const LOCAL_STORAGE_KEY = "recipientAddresses";

const useRecipientAddresses = () => {
  const [recipientAddresses, setRecipientAddresses] = useState<string[]>([]);

  useEffect(() => {
    const storedAddresses = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedAddresses) {
      setRecipientAddresses(JSON.parse(storedAddresses));
    }
  }, []);

  const addRecipient = useCallback(
    (address: string) => {
      if (includes(recipientAddresses, address)) {
        return;
      }

      const updatedAddresses = union(recipientAddresses, [address]);
      setRecipientAddresses(updatedAddresses);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedAddresses));
    },
    [recipientAddresses]
  );

  return { recipientAddresses, addRecipient };
};

export default useRecipientAddresses;
