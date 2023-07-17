import React, { FC, useMemo } from 'react';
import { Table, Button, message, Input, Modal } from 'antd';
import { ChangeData } from '~/utils/hooks/change';
import { columnsData } from './data';
import { Tag } from '~/components/Small/Tag';
import style from './index.module.css';
import { network } from '~/utils/network';
// import { data as acc } from './origin'
import { GetActivity } from '~/utils/hooks/getActivity'
import { showAct } from '~/utils/types'
import { useNavigate } from 'react-router-dom'

export interface showRow {
    id: number;
    name: string;
    state: number;
    mounts: number;
    quota: number;
    registerAt: {
        registration_start_time: string;
        registration_end_time: string;
    }
    ActAt: {
        activity_start_time: string;
        activity_end_time: string;
    }
    Move: {
        Exp: string;
        canup: boolean;
        cansee: boolean;
    }
}
export const HandleData: FC = () => {
    const Navigate = useNavigate();
    const { data } = network.teacher.useActivities();
    console.log("data", data)
    let flag = 0
    if (localStorage.getItem('activity') && data != undefined) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].id == -1) {
                flag = 1;
            }
        }
        if (flag == 0) {
            const local = localStorage.getItem("activity")

            data?.push(JSON.parse(local as string))
        }
    }
    let base: showAct[][] | undefined = undefined;
    data === undefined ? null : base = GetActivity(data);

    const { columns, rows } = ChangeData(columnsData, base as showAct[][]);

    const columnsRender = useMemo(() => {
        if (base) {
            return columns.map((item: any, index: number) => {
                if (index == 0) {
                    return {
                        ...item,
                        render: (name: string, record: showAct) => {
                            return (
                                <p
                                    style={{
                                        color: "#1890FF",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => Navigate(`${record?.id}`)}
                                >{name}</p>
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
                                    <p>{ActAt.activity_end_time}</p>
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
                        render: (Move: { Exp: string, canup: boolean, cansee: boolean }, record: showRow) => (
                            <div className={style.move}>
                                <Exp method={Move.Exp} id={record?.id} />
                                <Check canup={!Move.canup} id={record?.id} />
                                <Code cansee={!Move.cansee} id={record?.id} />
                            </div>
                        ),
                    }
                } else {
                    return item;
                }
            })
        } else {
            return []
        }

    }, [columns])
    return (
        <div>
            <Table columns={columnsRender} dataSource={rows} />
        </div>
    )
}



const Exp: React.FC<{ method: string, id: number }> = (props) => {
    //传进来一个字符串是编辑活动还是导出名单

    const [modal, setModal] = React.useState(false);
    const showModal = () => {
        setModal(true);
    };

    const handleOk = () => {
        setModal(false);
        Navigate(`/continue/-1`)
    };
    const Navigate = useNavigate()
    const handleCancel = () => {
        setModal(false);
    };


    return (
        <>
            {(props.method == "编辑活动") &&
                <Button
                    style={{
                        width: "64px",
                        height: "30px",
                        padding: "0"
                    }}
                    type='primary'
                    disabled
                >
                    <p style={{
                        margin: "0px",
                        padding: "0px",
                        textAlign: "center",
                        fontFamily: "Roboto",
                        fontSize: "12px",
                        fontStyle: "normal",
                        fontWeight: "400",
                        lineHeight: "24px",
                    }}>
                        {props.method}
                    </p>
                </Button >
            }
            {props.method == "导出名单" &&
                <Button
                    style={{
                        width: "64px",
                        height: "30px",
                        padding: "0"
                    }}
                    type='primary'
                    onClick={() => { network.teacher.downloadActivityStudentsExcel(props.id) }}
                >
                    <p style={{
                        margin: "0px",
                        padding: "0px",
                        textAlign: "center",
                        fontFamily: "Roboto",
                        fontSize: "12px",
                        fontStyle: "normal",
                        fontWeight: "400",
                        lineHeight: "24px",
                    }}>
                        {props.method}
                    </p>
                </Button>
            }
            {
                props.method == "继续编辑" &&
                <>
                    <Button
                        style={{
                            width: "64px",
                            height: "30px",
                            padding: "0"
                        }}
                        type='primary'
                        onClick={() => showModal()}
                    >
                        <p style={{
                            margin: "0px",
                            padding: "0px",
                            textAlign: "center",
                            fontFamily: "Roboto",
                            fontSize: "12px",
                            fontStyle: "normal",
                            fontWeight: "400",
                            lineHeight: "24px",
                        }}>
                            {props.method}
                        </p>
                    </Button >
                    <Modal open={modal} onOk={handleOk} onCancel={handleCancel}>
                        <p>是否继续编辑</p>
                    </Modal>
                </>

            }
            {
                props.method == '重新编辑' &&
                <Button
                    style={{
                        width: "64px",
                        height: "30px",
                        padding: "0"
                    }}
                    type='primary'
                    onClick={() => Navigate(`/reset/${props.id}`)}
                >
                    <p style={{
                        margin: "0px",
                        padding: "0px",
                        textAlign: "center",
                        fontFamily: "Roboto",
                        fontSize: "12px",
                        fontStyle: "normal",
                        fontWeight: "400",
                        lineHeight: "24px",
                    }}>
                        {props.method}
                    </p>
                </Button >
            }
        </>
    )
}
const Check: React.FC<{ canup: boolean, id: number }> = (props) => {
    //传进来一个bool类型值，如果是true，则可以进行审核
    const Navigate = useNavigate();
    return (
        <Button
            style={{
                width: "64px",
                height: "30px",
                padding: "0"
            }}
            type='primary'
            onClick={() => Navigate(`/activities/${props.id}`)}
            disabled={props.canup}
        >
            <p style={{
                margin: "0px",
                padding: "0px",
                textAlign: "center",
                fontFamily: "Roboto",
                fontSize: "12px",
                fontStyle: "normal",
                fontWeight: "400",
                lineHeight: "24px",
            }}>
                报名审核
            </p>
        </Button>
    )
}

const Code: React.FC<{ cansee: boolean; id: number }> = (props) => {
    const { data: num } = network.teacher.useCode(props.id);

    // console.log(num?.code)
    const [isOpen, setIsOpen] = React.useState(false)
    return (
        <div>
            {isOpen ? <SignInCode code={num?.code} /> : null}

            <Button
                style={{
                    width: '70px',
                    height: '30px',
                    padding: '0',
                }}
                disabled={props.cansee}
                type='primary'
                onClick={() => {
                    isOpen == true ? setIsOpen(false) : setIsOpen(true);
                }}
            >
                <p
                    style={{
                        margin: '0px',
                        padding: '0px',
                        textAlign: 'center',
                        fontFamily: 'Roboto',
                        fontSize: '12px',
                        fontStyle: 'normal',
                        fontWeight: '400',
                        lineHeight: '24px',
                    }}
                >
                    查看签到码
                </p>
            </Button>
        </div>
    );
};

//下面是点击签到码浮现出的组件
import { CopyOutlined } from '@ant-design/icons';
import { Space } from 'antd';
const SignInCode = (props: { code: string | undefined }) => {
    const handleCopy = () => {
        // 复制签到码的逻辑
        const signInCode = props.code; // 替换为实际的签到码
        if (signInCode === undefined
        ) {
            message.error('无签到码')
        } else {
            navigator.clipboard.writeText(signInCode);
            message.success('签到码已复制');
        }

    };

    return (
        <div
            style={{
                zIndex: "100",
                position: "absolute",
                top: "80px",
                // left: "-30px",
            }}
        >
            <Space>
                <Input value={props.code} readOnly style={{
                    width: "70px"
                }} />
                <Button type="primary" icon={<CopyOutlined />} onClick={handleCopy}>
                    复制
                </Button>
            </Space>

        </div >
    );
};

export default SignInCode;
