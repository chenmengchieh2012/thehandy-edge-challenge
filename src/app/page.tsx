import Image from 'next/image'
import styles from './page.module.css'
import VTagContext, { TagName__Setting, TagName__Starting } from '@/store/TagStore'
import CTabBody, { CTab } from '@/component/CTab'
import { IoCaretForwardOutline, IoSettingsOutline } from "react-icons/io5"
import VSettingPropsContext from '@/store/SettingProp'
import CSetting from '@/component/setting/CSetting'
import CInfo from '@/component/info/CInfo'
import CStart from '@/component/start/CStart'
import { useEffect } from 'react'
import VRunningStatusContext from '@/store/StatusStore'
import CNav from '@/component/CNav'
import CHandyKey from '@/component/CHandyKey'
import VHandyKeyContext from '@/store/HandyKey'

export default function Home() {

  return (
    <main className={styles.main}>
      <div className={`${styles["header"]}`}>
        <label>Edge Challenge!!</label>
        <p>
          This is the Challenge for person to training edge to orgasm
          <br/> Feel free and enjoy.
        </p>
      </div>
      <div  className={`${styles["body"]}`}>
        <VTagContext>
          <VSettingPropsContext>
          <VRunningStatusContext>
          <VHandyKeyContext>
            <>
            <div className={`${styles["left"]}`}>
                <CNav>
                  <>
                  <CTab icon={"IoSettingsOutline"} TagName={TagName__Setting}></CTab>
                  <CTab  icon={"IoCaretForwardOutline"} TagName={TagName__Starting}></CTab>
                  <CHandyKey></CHandyKey>
                  <CInfo/>
                  </>
                </CNav>
            </div>
            <div className={`${styles["right"]}`}>
            <CTabBody TagName={TagName__Setting}>
              <CSetting/>
            </CTabBody>
            <CTabBody TagName={TagName__Starting}>
              <CStart/>
            </CTabBody>
            </div>
            </>
          </VHandyKeyContext>
          </VRunningStatusContext>
          </VSettingPropsContext>
        </VTagContext>
      </div>
    </main>
  )
}
