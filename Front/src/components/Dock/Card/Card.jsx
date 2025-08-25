import { figCard, movCard }  from '../../../assets/cards/CardsIndex'

import styles from '../dock.module.css'

export const Card = ({ type, cardId }) => {
  let  card;
  let rot = {};
  if (type === 'mov') {
    card = movCard[cardId];
  } else  if (type === 'fig') {
    rot = {rotate: '-90deg'}
    card = figCard[cardId]
  }
  
  return (
  <span style={rot} className={styles.card}>
    <img src={card} alt="" />
  </span>
)};

