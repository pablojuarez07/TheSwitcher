import { createContext, useContext, useRef, useState, useCallback, useEffect } from "react"
import { animated, useIsomorphicLayoutEffect, useSpringValue } from "@react-spring/web"
import { clamp } from "@react-spring/shared"
import { useGesture } from "@use-gesture/react"

import { useMousePosition } from "../../hooks/useMousePosition"
import { useWindowResize } from "../../hooks/useWindowResize"

import styles from './dock.module.css'

const DOCK_ZOOM_LIMIT = [-100, 100]
const INITIAL_WIDTH = 48


export const DockContext = createContext({
  width: 0,
  hovered: false,
  setIsZooming: () => {}
})

 const useDock = () => {
  return useContext(DockContext)
}


export const Dock = ({ children }) => {
  const [hovered, setHovered] = useState(false)
  const [width, setWidth] = useState(0)
  const isZooming = useRef(false)
  const dockRef = useRef(null)

  const setIsZooming = useCallback(value => {
    isZooming.current = value
    setHovered(!value)
  }, [])

  const zoomLevel = useSpringValue(1, {
    onChange: () => {
      setWidth(dockRef.current.clientWidth)
    }
  })

  useWindowResize(() => {
    setWidth(dockRef.current.clientWidth)
  })

  return (
    <DockContext.Provider value={{ hovered, setIsZooming, width, zoomLevel }}>
      <animated.div
        ref={dockRef}
        className={styles.dock}
        onMouseOver={() => {
          if (!isZooming.current) {
            setHovered(true)
          }
        }}
        onMouseOut={() => {
          setHovered(false)
        }}
        style={{
          x: "-50%",
          scale: zoomLevel
            .to({
              range: [DOCK_ZOOM_LIMIT[0], 1, DOCK_ZOOM_LIMIT[1]],
              output: [2, 1, 0.5]
            })
            .to(value => clamp(0.5, 2, value))
        }}
      >
        {children}
      </animated.div>
    </DockContext.Provider>
  )
}


/////////////////////////////


export const DockCard = ({ children, sel, setSel, index,
                           setMovSelect, setMovTypeSelect,
                           setFigSelect, setFigTypeSelect, isMov,
                           yourFig }) => {
  const cardRef = useRef(null)
  /**
   * This doesn't need to be real time, think of it as a static
   * value of where the card should go to at the end.
   */
  const [elCenterX, setElCenterX] = useState(0)

  const size = useSpringValue(INITIAL_WIDTH, {
    config: {
      mass: 0.1,
      tension: 320
    }
  })

  const opacity = useSpringValue(0)
  const y = useSpringValue(0, {
    config: {
      friction: 29,
      tension: 238
    }
  })

  const dock = useDock()

  /**
   * This is just an abstraction around a `useSpring` hook, if you wanted you could do this
   * in the hook above, but these abstractions are useful to demonstrate!
   */
  useMousePosition(
    {
      onChange: ({ value }) => {
        const mouseX = value.x

        if (dock.width > 0) {
          const transformedValue =
            INITIAL_WIDTH +
            36 *
              Math.cos((((mouseX - elCenterX) / dock.width) * Math.PI) / 2) **
                12

          if (dock.hovered) {
            size.start(transformedValue)
          }
        }
      }
    },
    [elCenterX, dock]
  )

  useIsomorphicLayoutEffect(() => {
    if (!dock.hovered) {
      size.start(INITIAL_WIDTH)
    }
  }, [dock.hovered])


  const timeoutRef = useRef()
  const isAnimating = useRef(false)

  const handleClick = () => {

    

    if (sel === index) {
      // Si la carta ya está seleccionada, al hacer clic de nuevo se deselecciona.
      setSel(false);
      if(isMov) {
        setMovSelect(null); // Se pone en null el movSelect
        setMovTypeSelect(null);  
      } else {
        setFigSelect(null);
        setFigTypeSelect(null);
      }
    } else {
      setSel(index);  // Si la carta no estaba seleccionada, se selecciona
      //setMovSelect(index);  // Se actualiza movSelect con el índice de la carta seleccionada
    }
    //if (sel != index) {setSel(index);}
    if (!isAnimating.current) {
      isAnimating.current = true
      opacity.start(0.5)

      y.start(-INITIAL_WIDTH / 2, {
        from: 0,
        to: -INITIAL_WIDTH / 2,
      })
    } else {
      clearTimeout(timeoutRef.current)
      opacity.start(0)
      y.start(0)
      isAnimating.current = false
    }

  }

  useEffect(() => { 
    if (sel != index) {
      clearTimeout(timeoutRef.current)
      opacity.start(0)
      y.start(0)
      isAnimating.current = false
    }
  }, [sel])


  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  return (
    <div className={styles["dock-card-container"]} style={{padding: "10px"}}>
      <animated.button
        ref={cardRef}
        className={styles["dock-card"]}
        onClick={handleClick}
        style={{
          rotate: "90deg",
          width: "60px",
          height: "auto",
          y
        }}
      >
        {children}
      </animated.button>
      <animated.div className={styles["dock-dot"]} style={{ opacity }} />
    </div>
  )
}

///////////////////////////////////////

export const DockDivider = () => {
  const { zoomLevel, setIsZooming } = useDock()

  const bind = useGesture(
    {
      onDrag: ({ down, offset: [_ox, oy], cancel, direction: [_dx, dy] }) => {
        /**
         * Stop the drag gesture if the user goes out of bounds otherwise
         * the animation feels stuck but it's the gesture state catching
         * up to a point where the scaling can actualy animate again.
         */
        if (oy <= DOCK_ZOOM_LIMIT[0] && dy === -1) {
          cancel()
        } else if (oy >= DOCK_ZOOM_LIMIT[1] && dy === 1) {
          cancel()
        } else if (zoomLevel) {
          zoomLevel.start(oy, {
            immediate: down
          })
        }
      },
      onDragStart: () => {
        setIsZooming(true)
      },
      onDragEnd: () => {
        setIsZooming(false)
      }
    },
    {
      drag: {
        axis: "y"
      }
    }
  )

  if (!zoomLevel) {
    return null
  }

  return (
    <div className={styles.divider__container} {...bind()}>
      <span className={styles.divider}></span>
    </div>
  )
}