import React, { useState, useEffect, useRef } from "react";
import "../../styles/ChatBot.css";
import { useLocation } from "react-router-dom";
import { createBrowserHistory } from "history";
import { useDispatch, useSelector } from "react-redux";
import {
  getChatHistoryConversation,
  qnaChatbotSession,
  QnaChatbotSuccess,
  createChatHistoryData,
  createChatHistoryDataSuccess,
} from "../../actions/dataConsoleAction";
import { Image, Input } from "semantic-ui-react";

const Message = ({ text, isQuestion }) => (
  <div className={`message ${isQuestion ? "question" : "answer"}`}>
    <div className="question-box">
      {text.split("\n").map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < text.split("\n").length - 1 && <br />}
        </React.Fragment>
      ))}
      {isQuestion ? (
        <div className="icons-question">
          <img src="/images/user-chat-icon.svg" alt="chat Icon" />
        </div>
      ) : (
        <div className="icons-answer">
          <img src="/images/question-chat-icon.svg" alt="chat Icon" />
        </div>
      )}
    </div>
  </div>
);

const MessageList = ({ messages }) => (
  <div>
    {messages.map((message, index) => (
      <Message
        key={index}
        text={message.text}
        isQuestion={message.isQuestion}
      />
    ))}
  </div>
);

const InputArea = ({ onSendQuestion }) => {
  const [input, setInput] = useState("");
  const serachQueryParams = new URLSearchParams(location.search);
  const searchBotDatasetParam = serachQueryParams.get("c");
  // Function to check if a string contains only characters and numbers or if it's empty
  const containsSpecialCharactersOrEmpty = (str) => {
    // Regular expression to match characters, numbers, and special characters
    const specialCharactersRegex =
      /^[a-zA-Z0-9\s!"#$%&'()*+,-./:;<=>?@[\\\]_`{|}~]*$/;
    // Return true if the string is empty or contains characters, numbers, and special characters
    return specialCharactersRegex.test(str);
  };
  const handleSend = () => {
    if (input && containsSpecialCharactersOrEmpty(input)) {
      onSendQuestion(input);
      setInput("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="asAssistantSearchBox">
      <div className="input-with-icon asAssistantSearch">
        <textarea rows="1" onkeypress="auto_grow(this);" onkeyup="auto_grow(this)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask question"
          onKeyPress={handleKeyPress}
          className="custom-ai-input"
        />
        <Image
          className="icon-image"
          src="/images/grey-send.svg"
          alt="New Chat"
          onClick={handleSend}
        />
        <div className="ai-dataset-box">
          {searchBotDatasetParam.length > 10
            ? searchBotDatasetParam.slice(0, 10) + ".."
            : searchBotDatasetParam}
        </div>
      </div>
    </div>
  );
};

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [chatFlag, setchatFlag] = useState(false);
  const [newChatFlag, setnewChatFlag] = useState(false);
  const [newQueryParam, setnewQueryParam] = useState(null);
  const dispatch = useDispatch();
  const isMounted = useRef(true);
  const messagesDivRef = useRef(null);
  const { loading, chatData, error } = useSelector(
    (state) => state.ChatHistoryConversation || {}
  );
  const { qnaData } = useSelector((state) => state.qnaChatBot || {});
  const { chatHistoryData } = useSelector(
    (state) => state.qnaChatHistory || {}
  );
  const location = useLocation();
  const history = createBrowserHistory();
  const queryParams = new URLSearchParams(location.search);
  const chatBotQueryParam = queryParams.get("cid");
  const chatBotDatasetParam = queryParams.get("c");

  useEffect(() => {
    if (chatBotQueryParam) {
      fetchData(chatBotQueryParam);
    }
  }, [chatBotQueryParam]);

  useEffect(() => {
    if (chatHistoryData && chatHistoryData.status_code === 200) {
      if (chatBotQueryParam) {
        queryParams.set("cid", chatHistoryData.id);
      } else {
        queryParams.append("cid", chatHistoryData.id);
      }
      const updatedUrl = `${location.pathname}?${queryParams.toString()}`;
      history.push(updatedUrl);
      setnewChatFlag(true);
      setnewQueryParam(chatHistoryData.id);
      dispatch(createChatHistoryDataSuccess([]));
    }
  }, [chatHistoryData]);

  useEffect(() => {
    const newMessages = [];
    if (!loading && chatData != null && chatBotQueryParam) {
      if (chatData.humanmessage)
        for (
          let i = 0;
          i < Math.max(chatData.humanmessage.length, chatData.aimessage.length);
          i++
        ) {
          if (chatData.humanmessage[i]) {
            newMessages.push({
              text: chatData.humanmessage[i],
              isQuestion: true,
            });
          }
          if (chatData.aimessage[i]) {
            newMessages.push({
              text: chatData.aimessage[i],
              isQuestion: false,
            });
          }
        }
    }
    setMessages(newMessages);
  }, [chatData, loading, chatBotQueryParam]);

  useEffect(() => {
    if (messagesDivRef.current) {
      messagesDivRef.current.scrollTop = messagesDivRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (chatFlag && qnaData.status_code === 200) {
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages.slice(0, -1),
          { isQuestion: false, text: qnaData.aimessage },
        ]);
        createChatHistory(qnaData);
        setchatFlag(false);
        dispatch(QnaChatbotSuccess([]));
      }, 500);
    }
  }, [qnaData, chatFlag]);

  const fetchData = async (chatBotQueryParam) => {
    try {
      const formData = new FormData();
      formData.append(
        "json",
        JSON.stringify({
          id: chatBotQueryParam,
        })
      );
      dispatch(getChatHistoryConversation(formData));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const createChatHistory = async (qnaData) => {
    try {
      const formData = new FormData();
      formData.append(
        "json",
        JSON.stringify({
          id:
            chatBotQueryParam || newChatFlag
              ? newChatFlag
                ? newQueryParam
                : chatBotQueryParam
              : "new",
          datasetname: chatBotDatasetParam,
          humanmessage: qnaData.humanmessage,
          aimessage: qnaData.aimessage,
        })
      );
      dispatch(createChatHistoryData(formData));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSendQuestion = (questionText) => {
    try {
      const questionsVal = [];
      const answersVal = [];
      if (messages.length > 0) {
        messages.forEach((item) => {
          if (item.isQuestion) {
            questionsVal.push(item.text);
          } else {
            answersVal.push(item.text);
          }
        });
      }
      const formData = new FormData();
      formData.append(
        "json",
        JSON.stringify({
          dataset_name: chatBotDatasetParam,
          query: questionText,
          questions: questionsVal.length > 0 ? [questionsVal.join(", ")] : [],
          answers: answersVal.length > 0 ? [answersVal.join(", ")] : [],
        })
      );
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { isQuestion: true, text: questionText },
          { isQuestion: false, text: "Loading..." },
        ]);
        setchatFlag(true);
      }, 500);
      dispatch(qnaChatbotSession(formData));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="chat-container">
      <div ref={messagesDivRef} className="chat-message-area">
        <MessageList messages={messages} />
      </div>
      <InputArea onSendQuestion={handleSendQuestion} />
    </div>
  );
};

export default ChatBot;
