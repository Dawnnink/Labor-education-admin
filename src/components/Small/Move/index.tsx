import React, { FC, useState } from 'react';
import { Button, Modal } from 'antd';


interface Num {
    Exp?: number;//1-3
    Che?: number;//1-2
    Del?: number;//1
    key?: React.Key;
}
type Btn = "primary" | "link" | "text" | "ghost" | "default" | "dashed" | undefined;
export const MoveBtn: FC<Num> = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    }
    const handleOK = () => {
        setIsModalOpen(false);
    }
    const handleCancel = () => {
        setIsModalOpen(false);
    }

    let color: Btn = undefined;
    let text = '';
    let isDis = false;
    let isDel = false;
    let handleEvent: () => void;
    switch (props.Exp) {
        case 1:
            color = 'primary';
            text = '导出名单';
            break;
        case 2:
            color = 'primary';
            text = '继续编辑';
            break;
        case 3:
            color = 'primary';
            isDis = true;
            text = '导出名单';
            break;
        case 4:
            color = 'primary';
            text = '修改活动';
            break
        default:
            break;
    }
    switch (props.Che) {
        case 1:
            color = 'primary';
            text = '报名审核';
            break;
        case 2:
            color = 'primary';
            text = '报名审核';
            isDis = true;
            break;
        default:
            break;

    }
    console.log(props.Del)
    console.log(props.Del)
    switch (props.Del) {
        case 1:
            color = 'primary';
            text = '删除活动';
            isDel = true;
            handleEvent = () => {
                showModal()
                console.log(props.key)
            };
            break;
        default:
            break;
    }
    return (
        <div>
            <Button
                style={{
                    width: "64px",
                    height: "24px",
                    padding: "0"
                }}
                type={color}
                disabled={isDis}
                danger={isDel}
                key={props.key}

                onClick={() => handleEvent()}
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
                    {text}
                </p>
            </Button>
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOK} onCancel={handleCancel}>
                <p>确认删除?</p>
            </Modal>
        </div >
    )
}