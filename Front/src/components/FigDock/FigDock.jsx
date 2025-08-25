

import React from 'react'
import { Card } from '../Dock/Card/Card'
import { Dock, DockCard, DockDivider } from '../Dock/Dock'
import UseFig from './UseFig'

import { UserInfo } from '../UserInfo/UserInfo'


export default function FigDock({ player, cardsArray, stl, uiStyle, turn, 
                                  setFigSelect, figsId, figsType,
                                  figTypeSelect, setFigTypeSelect,
                                  yourFig, setIsYour, setMovSelect, setMovTypeSelect }) {

  let [sel, setSel] = React.useState(false);

  React.useEffect(() => {
    
      setFigSelect(figsId[sel] || null);
      setFigTypeSelect(figsType[sel] || null);
      setIsYour(yourFig);
      //console.log("select Fig id:", figSelect);
      //console.log("type fig select: ", figTypeSelect);
    
  }, [sel]);


  return (
    <div style={stl}>
        <Dock>

          {
            <UserInfo 
              player={player ? player : {username: "CPU", player_id: 0}} 
              isTurn={turn}
              uiStyle={uiStyle}
            />
          }

          {cardsArray.map((cardId, index) => {
            return cardId ? (
              <DockCard key={`${cardId.type}-${index}`} sel={sel} setSel={setSel} index={index} 
                        setFigTypeSelect={setFigTypeSelect} setFigSelect={setFigSelect}
                        isMov={false} yourFig={yourFig}
                        setMovSelect={setMovSelect} 
                        setMovTypeSelect={setMovTypeSelect} >

                <Card type="fig" cardId={cardId.type} />
              </ DockCard >
            ) : (
              <DockDivider key={index} />
            )
          })}
        </Dock>
      </div>
  )

}    