import React, { useState, useEffect, useRef } from 'react';
import styles from './Chat.module.css';
import { useWebSocket } from "../../services/websocket";
import sendIcon from "../../assets/img/send_icon.svg";
import Message from "./Message";
import api from "../../services/api";

const Chat = ({ player_id }) => {
    const ws = useWebSocket();
    const [messages, setMessages] = useState([]);
    const [msgCounter, setMsgCounter] = useState(0);
    const [input, setInput] = useState('');
    const msgContainer = useRef(null);

    const createMessage = (data) => {
        try {
            const newMessage = <Message key={msgCounter} msgsData={data["message"]} />;
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setMsgCounter((prevCounter) => prevCounter + 1);
        } catch (error) {
            console.error("Error in createMessage:", error);
        }
    };

    useEffect(() => {
        ws.on("chat-message", createMessage);
        console.log("Chat component mounted", player_id);
        return () => {
            ws.off("chat-message", createMessage);
        };
    }, []);

    useEffect(() => {
        const messages = msgContainer.current;
        if (messages) {
            messages.scrollTop = messages.scrollHeight + 100000000;
        }
    }, [messages]);

    const handleSend = async () => {
        try {
            console.log("Chat component mounted", player_id["player_id"]);
            const response = await api.putData(
                `players/${player_id}/send_message`,
                { "content": input }
            );
            console.log(response);
            setInput('');
        } catch (error) {
            console.error("Error in send message:", error);
        }
    };

    return (
        <div className={styles.chat_container}>
            <div ref={msgContainer} className={styles.msg_container}>
                {messages.map((msg, index) => (
                    <div key={index}>
                        {msg}
                    </div>
                ))}
            </div>
            <div className={styles.input_container}>
                <input
                    className={styles.chat_input}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button onClick={handleSend} className={styles.chat_sendbutton}>
                    <img src={sendIcon} alt="sendIcon" />
                </button>
            </div>
        </div>
    );
};

export default Chat;