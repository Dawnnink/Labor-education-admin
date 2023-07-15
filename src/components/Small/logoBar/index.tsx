import style from './index.module.css';
import { FC } from 'react';
import Logo from '~assets/svg/logo.svg'
export const LogoBar: FC = () => {


    return (
        <div className={style.xbox}>
            <img src={Logo} alt="" />
            <p>南昌大学劳动教育平台教师端</p>
        </div>
    )
}