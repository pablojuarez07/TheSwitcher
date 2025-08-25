import React, { useEffect, useState } from 'react';
import styles from './Chat.module.css';

const Message = ({ msgsData }) => {
    const [msgType, setMsgType] = useState('');
    const [msgContent, setMsgContent] = useState('');
    const [msgTimeStamp, setMsgTimeStamp] = useState('');
    const [msgSender, setMsgSender] = useState('');
    const [msgBody, setMsgBody] = useState('');
    const [msgStl, setMsgStl] = useState(null);

    function stringToColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++)
            hash = str.charCodeAt(i) + ((hash << 5) - hash);

        let color = '#';
        for (let i = 0; i < 3; i++) {
            let value = (hash >> (i * 8)) & 0xFF;
            color += ('00' + value.toString(16)).substr(-2);
        }
        return color;
    }

    useEffect(() => {
        setMsgType(msgsData["message_type"]);
        const content = msgsData["content"].split(":");
        if (msgsData["message_type"] == "PlayerMessage") {
            setMsgSender(content[0]);
            setMsgBody(content[1]);
        } else {
            setMsgSender("[Log] ");
            setMsgBody(content[0]);
            setMsgStl({ filter: "opacity(60%)" });
        }

        setMsgTimeStamp(msgsData["time_sent"]);


    }, [msgsData]);

    return (
        <div style={msgStl} >
            <div className={styles.msg} >
                <span style={{ color: stringToColor(msgSender) }} className={styles.msg_sender}>{msgSender}</span>
                <span className={styles.msg_timestamp}>{msgTimeStamp}</span>
            </div>
            <div>
                {msgBody}
            </div>
        </div>
    );
};

export default Message;