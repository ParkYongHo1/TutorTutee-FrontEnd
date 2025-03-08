import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { EventSourcePolyfill } from "event-source-polyfill";
const useSSE = ({ setAlarms }) => {
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
      const source = new EventSourcePolyfill(
        `${process.env.REACT_APP_BASE_URL}/alim/subscribe?memberNum=${memberNum}`,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
      console.log(source);

      source.onopen = () => {
        console.log("EventSource connection opened.");
      };

      source.onmessage = (event) => {
        console.log(event.data);

        const data = JSON.parse(event.data);
        setAlarms(data);
      };

      source.onerror = () => {
        source.close();
        eventSourceRef.current = null;
        console.log("error");

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
  }, [access, isLoggedIn, memberNum, eventSourceRef, setAlarms]);
};

export default useSSE;
