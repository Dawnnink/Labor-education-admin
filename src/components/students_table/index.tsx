import { Card } from "antd";
import { FC } from "react";

import { TableTitle } from "./title";
import { TableTag } from "./tab";

const fakeStudentListData = [
    {
        Name: "吴中生",
        College: "数学与计算机学院",
        Sex: "男",
        Status: 1,
    },
    {
        Name: "吴中生",
        College: "数学与计算机学院",
        Sex: "男",
        Status: 1,
    },
    {
        Name: "吴中生",
        College: "数学与计算机学院",
        Sex: "男",
        Status: 1,
    },
    {
        Name: "吴中生",
        College: "数学与计算机学院",
        Sex: "男",
        Status: 1,
    },
    {
        Name: "吴中生",
        College: "数学与计算机学院",
        Sex: "男",
        Status: 1,
    },
    {
        Name: "吴中生",
        College: "数学与计算机学院",
        Sex: "男",
        Status: 1,
    },
    {
        Name: "吴中生",
        College: "数学与计算机学院",
        Sex: "男",
        Status: 1,
    },
    {
        Name: "吴中生",
        College: "数学与计算机学院",
        Sex: "男",
        Status: 1,
    },
]

export const StundesTable: FC = () => {

    return <div>
        <Card bodyStyle={{ width: "1100px" }} title={<TableTitle />} extra={<a href="#">导出</a>} style={{ width: "1100px", height: 376 }}>
            <TableTag Data={fakeStudentListData} />
        </Card>
    </div>

}