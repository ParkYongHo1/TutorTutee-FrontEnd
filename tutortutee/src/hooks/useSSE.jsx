import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
const useSSE = (onMessage) => {
  const eventSourceRef = useRef(null);
  const isLoggedIn = useSelector((state) => state.member.isLoggedIn);
  const memberNum = useSelector((state) => state.member.member.memberNum);
  const access = useSelector((state) => state.member.access);
  const reconnectAttempts = useRef(0);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const createEventSource = () => {
      const source = new EventSource(
        `${process.env.REACT_APP_BASE_URL}/alim/subscribe?memberNum=${memberNum}`
      );

      source.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onMessage(data);
      };

      source.onerror = () => {
        source.close();
        eventSourceRef.current = null;
        if (reconnectAttempts.current < 5) {
          reconnectAttempts.current += 1;
          setTimeout(createEventSource, 2000);
        }
      };

      eventSourceRef.current = source;
      reconnectAttempts.current = 0;
    };

    createEventSource();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [access, isLoggedIn, memberNum, eventSourceRef, onMessage]);
};

export default useSSE;
