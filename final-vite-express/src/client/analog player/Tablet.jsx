import { useEffect } from "react";
import tabletSprite from "./assets/Tablet.png"
import styles from "./Tablet.module.css"
import ButtonSprite from "./assets/Dial.png"

export default function StoneTablet() {

    return <article className={styles.stoneTablet} style={{ backgroundImage: `url(${tabletSprite})` }}>
        <div style={{ margin: '40px 50px', height: '550px', width: '330px' }}>
            <div className={styles.waveOrder} >

            </div>
            <div className={styles.allButtons}>
                <TabletButton />
            </div>
        </div>
    </article >

    function TabletButton() {

        const style = {
            width: '75px',
            height: '75px'
        }

        // TODO: Make some example symbol images, create styling for buttons, give them onClick function
        return (<img style={style} src={ButtonSprite} >
        </img >)
    }
}

