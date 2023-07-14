import React, { FC } from 'react';
import style from './index.module.css';

interface Name {
    name: string;
}

export const Title: FC<Name> = (props) => {

    return (
        <div className={style.box}>
            <div className={style.ybox}>
                {props.name}
            </div>
        </div>
    )
}