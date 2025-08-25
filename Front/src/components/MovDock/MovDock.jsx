
import React from 'react'
import { Card } from '../Dock/Card/Card'
import { Dock, DockCard, DockDivider } from '../Dock/Dock'



export default function MovDock({ cardsArray, setMovSelect, movSelect, 
                                  movsId, setMovTypeSelect, movTypeSelect,
                                  movsType }) {
    let [sel, setSel] = React.useState(false);


    React.useEffect(() => {
      setMovSelect(movsId[sel] || null);
      setMovTypeSelect( movsType[sel] || null );
      console.log("select Mov id:", movSelect);
      console.log("type select: ", movTypeSelect);
      console.log("cardArray in MovDock: ", cardsArray);
    }, [sel]);

    return (
      <div style={{translate: "-58vh -6vh", rotate: "90deg", scale:"1.2"}}>
      <Dock style={{background: "rgba(0, 0, 0, 0.92)"}} >
        {cardsArray.map((cardId, index) => {
          return cardId ? (
            <DockCard key={`${cardId.type}-${index}`} sel={sel} setSel={setSel} index={index} 
                      setMovSelect={setMovSelect} setMovTypeSelect={setMovTypeSelect} isMov={true}
                      yourFig={true} >


              <Card type="mov" cardId={cardId.type} movSelect={movSelect} />

            </DockCard>
          ) : (
            <DockDivider key={index} />
          )
        })}
      </Dock>
    </div>
  )
}    
