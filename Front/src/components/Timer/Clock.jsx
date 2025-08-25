import { useEffect, useState } from "react";


export default function Clock({ currentPlayer }) {
    const [time, setTime] = useState(120);
    const maxTime = 120; 

    const onTimeEnd = () => {
        console.log("Time's up!");
        setTime(120);
    }

    useEffect(() => {
        if (time === 0) {
            onTimeEnd();
        }

        const interval = setInterval(() => {
            setTime((time) => Math.max(time - 1, 0)); 
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [time]);

    useEffect(() => {
        setTime(120);
    }, [currentPlayer]);

    const getColor = () => {
        if (time > 60) return "#4CAF50"; 
        if (time > 30) return "#FF9800";
        return "#f44336";
    };

    
    const getRotation = () => {
        return (360 * (maxTime - time)) / maxTime; // Angulo entre 0 y 360
    };

    return (
        <div style={{
            ...styles.circle,
            backgroundColor: getColor(),
        }}>
            <span style={styles.clockText}></span>
            <div style={{
                ...styles.hand,
                transform: `rotate(${getRotation()}deg)`, // Rota la manecilla
            }} />
        </div>
    );
}

// Estilos en línea
const styles = {
    circle: {
            position: "fixed",
            top: "2vh",
            right: "25vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
            width: "130px",
            height: "130px",
            minWidth: "130px",  // Asegura un tamaño mínimo
            minHeight: "130px", // Asegura un tamaño mínimo
            transition: "background-color 0.5s ease",
    },
    clockText: {
        fontSize: "2rem",
        fontWeight: "bold",
        color: "#FFFFFF", // Texto en blanco para visibilidad
        zIndex: 1, // Asegura que el texto esté sobre la manecilla
    },
    hand: {
        position: "absolute",
        width: "2px",
        height: "55px", // Largo de la manecilla
        backgroundColor: "#FFFFFF", // Color de la manecilla
        bottom : "60px",
        transformOrigin: "center bottom", // Punto de rotación en el borde inferior
        transition: "transform 0.5s linear",
    },
};