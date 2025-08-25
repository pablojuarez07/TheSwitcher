import { useState, useEffect } from 'react';
import styles from './ForbiddenColor.module.css';
import forbiddenIcon from '../../assets/img/forbidden_icon.svg';

const ForbiddenColor = ({ color }) => {
    const [colorRender, setColorRender] = useState(["#333", "None"]);

    useEffect(() => {
        switch (color) {
            case "r": setColorRender(["#df5d4f", "Red"]);    break;
            case "b": setColorRender(["#61b5a4", "Blue"]);   break;
            case "g": setColorRender(["#a7b552", "Green"]);  break;
            case "y": setColorRender(["#f3d25c", "Yellow"]); break;
            default: break;
        }
    }, [color]);

  return <div className={styles.container} style={{backgroundColor:`${colorRender[0]}`}}>
    <img src={forbiddenIcon} alt="forbidden icon" className={styles.img} />
    <p>
        <span className={styles.text1}>Forbidden Color</span>
        <br/>
        <span className={styles.text2}>{colorRender[1]}</span>
    </p>
    </div>;
};

export default ForbiddenColor;