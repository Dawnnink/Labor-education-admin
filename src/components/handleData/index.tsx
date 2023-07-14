import React, { FC, useMemo } from 'react';
import { Table } from 'antd';
import { ChangeData } from '~/utils/hooks/change';
import { columnsData, rowsData } from './data';
import { Tag } from '~/components/Small/Tag';
import { MoveBtn } from '~/components/Small/Move';
import style from './index.module.css';
import { network } from '~/utils/network';
// import { data as acc } from './origin'
import { GetActivity } from '~/utils/hooks/getActivity'
import { basename } from 'node:path/win32';
import { IIN } from '~/utils/hooks/getActivity'

export const HandleData: FC = () => {
    const { data, error } = network.teacher.useActivities();

    const base = GetActivity(data as IIN[]);
    const { columns, rows } = ChangeData(columnsData, base);

    // console.log("acc", data)
    function delAct(id: number) {
        network.teacher.delActivities(id)
    }
    const columnsRender = useMemo(() => {
        console.log(rows)
        return columns.map((item: any, index: number) => {
            console.log(index)
            if (index == 0) {
                return {
                    ...item,
                    render: (name: string) => {
                        return (
                            <p style={{ color: "#1890FF", cursor: "pointer" }}>{name}</p>
                        )
                    }
                }
            }
            if (index == 4) {
                return {
                    ...item,
                    render: (registerAt: { registration_start_time: string, registration_end_time: string }) => {
                        return (
                            <div>
                                <p>{registerAt.registration_start_time}</p>
                                <p>{registerAt.registration_end_time}</p>
                            </div>
                        )
                    }
                }
            } if (index == 5) {
                return {
                    ...item,
                    render: (ActAt: { activity_start_time: string, activity_end_time: string }) => {
                        return (
                            <div>
                                <p>{ActAt.activity_start_time}</p>
                                <p>{ActAt.activity_start_time}</p>
                            </div>
                        )
                    }
                }


            }
            if (index == 1) {
                return {
                    ...item,
                    render: (state: number) => (
                        <div >
                            <Tag num={state} />
                        </div>
                    ),
                }
            } else if (index == 6) {
                return {
                    ...item,
                    render: (Move: { isExport: number, isChecking: number, isDelete: number }, key: React.Key) => (
                        <div className={style.move}>

                            <MoveBtn Exp={Move.isExport} />
                            <MoveBtn Che={Move.isChecking} />
                            <MoveBtn Del={Move.isDelete} />
                        </div>
                    ),
                }
            } else {
                return item;
            }
        })
    }, [columns])
    return (
        <div>
            <Table columns={columnsRender} dataSource={rows} />
        </div>
    )
}