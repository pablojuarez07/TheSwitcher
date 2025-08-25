import React from 'react';
import { CountdownCircleTimer } from "react-countdown-circle-timer";

export default function MyTimer({ expiryTimestamp }) {
    const renderTime = ({ remainingTime }) => {
        if (remainingTime === 0) {
          return <div className="timer">Too lale...</div>;
        }
      
        return (
          <div className="timer" >
            <div className="value" style={{fontSize: "4rem", color:"#d9d9d9"}}>{remainingTime}</div>
            <div style={{fontSize: "1.3rem", color:"#d9d9d9", textAlign: "center"}}>sec</div>
          </div>
        );
      };
  return (
    <div style={{ 
        backgroundColor: "#492617ff",
        boxShadow: "0px 0px 100px  -30px #00000097",
        borderRadius: "50%",
        position: "absolute",
        scale: "0.7",
        marginTop: "10px",
        marginRigth: "30vh", }}
    className="timer-wrapper">
        <CountdownCircleTimer style
          isPlaying
          duration={120}
          colors={["#61b5a4ff", "#a7b552ff", "#f3d25cff", "#df5d4fff", "#df5d4fff"]}
          colorsTime={[120, 90, 60, 30, 0]}
          onComplete={() => ({ shouldRepeat: true, delay: 1 })}
        >
          {renderTime}
        </CountdownCircleTimer>
      </div>
  );
}
