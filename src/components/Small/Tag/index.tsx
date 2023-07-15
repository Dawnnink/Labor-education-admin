import React from "react";

interface Num {
    num: number;
}

export const Tag: React.FC<Num> = (props) => {
    let color = "";
    let text = "";

    switch (props.num) {
        case 1:
            color = "#52C41A";
            text = "报名中";
            break;
        case 2:
            color = "#D9D9D9";
            text = "未发布";
            break;
        case 3:
            color = "#FF4D4F";
            text = "审核失败";
            break;
        case 4:
            color = "#1890FF";
            text = "已结束";
            break;
        case 5:
            color = "#DEB72D";
            text = "审核中";
            break;
        case 6:
            color = '#D9D9D9';
            text = '待报名';
            break;
        case 7:
            color = '#FF4D4F';
            text = '待开始';
            break;
        case 8:
            color = '#FF4D4F';
            text = '进行中';
            break;
        default:
            break;
    }

    return (
        <div>
            <p style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: "8px",
                maxWidth: "102px",
                height: "22px",

            }}>
                <span style={{
                    display: "inline-block",
                    lineHeight: "22px",
                    width: "6px", height: "6px",
                    backgroundColor: color,
                    borderRadius: "50%"
                }}>
                </span>
                {text}
            </p>
        </div>
    );
};
