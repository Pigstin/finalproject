import { useEffect } from "react";
import tabletSprite from "./assets/Tablet.png"
import styles from "./Tablet.module.css"
import ButtonSprite from "./assets/Dial.png"
import Symbol1 from "./assets/Tablet Buttons/symbol1.svg"
import Symbol2 from "./assets/Tablet Buttons/symbol2.svg"
import Symbol3 from "./assets/Tablet Buttons/symbol3.svg"
import Symbol4 from "./assets/Tablet Buttons/symbol4.svg"
import Symbol5 from "./assets/Tablet Buttons/symbol5.svg"
import Symbol6 from "./assets/Tablet Buttons/symbol6.svg"
import Symbol7 from "./assets/Tablet Buttons/symbol7.svg"
import Symbol8 from "./assets/Tablet Buttons/symbol8.svg"
import Symbol9 from "./assets/Tablet Buttons/symbol9.svg"
import Symbol10 from "./assets/Tablet Buttons/symbol10.svg"
import Symbol11 from "./assets/Tablet Buttons/symbol11.svg"
import Symbol12 from "./assets/Tablet Buttons/symbol12.svg"
import Symbol13 from "./assets/Tablet Buttons/symbol13.svg"
import Symbol14 from "./assets/Tablet Buttons/symbol14.svg"
import Symbol15 from "./assets/Tablet Buttons/symbol15.svg"
import Symbol16 from "./assets/Tablet Buttons/symbol16.svg"
import Symbol17 from "./assets/Tablet Buttons/symbol17.svg"
import Symbol18 from "./assets/Tablet Buttons/symbol18.svg"
import Symbol19 from "./assets/Tablet Buttons/symbol19.svg"
import Symbol20 from "./assets/Tablet Buttons/symbol20.svg"

export default function StoneTablet() {

    return <article className={styles.stoneTablet} style={{ backgroundImage: `url(${tabletSprite})` }}>
        <div style={{ margin: '40px 50px', height: '550px', width: '330px' }}>
            <div className={styles.waveOrder} >

            </div>
            <div style={{ height: '20px' }}></div>
            <div className={styles.allButtons}>
                <TabletButton src={Symbol1} />
                <TabletButton src={Symbol2} />
                <TabletButton src={Symbol3} />
                <TabletButton src={Symbol4} />
                <TabletButton src={Symbol5} />
                <TabletButton src={Symbol6} />
                <TabletButton src={Symbol7} />
                <TabletButton src={Symbol8} />
                <TabletButton src={Symbol9} />
                <TabletButton src={Symbol10} />
                <TabletButton src={Symbol11} />
                <TabletButton src={Symbol12} />
                <TabletButton src={Symbol13} />
                <TabletButton src={Symbol14} />
                <TabletButton src={Symbol15} />
                <TabletButton src={Symbol16} />
                <TabletButton src={Symbol17} />
                <TabletButton src={Symbol18} />
                <TabletButton src={Symbol19} />
                <TabletButton src={Symbol20} />
            </div>
        </div>
    </article >

    function TabletButton({ src }) {

        const style = {
            width: '75px',
            height: '75px'
        }

        // TODO: Make some example symbol images, create styling for buttons, give them onClick function
        return (
            <img className={styles.tabButton} src={src} ></img >
        )
    }
}

