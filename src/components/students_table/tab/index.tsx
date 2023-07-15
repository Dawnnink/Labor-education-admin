import { Tabs, TabsProps } from "antd";
import { FC } from "react";
import { StudentList } from "../student_list";

const onChange = (key: string) => {
    console.log(key);
};

interface AllStudent {
    Data: Array<Student>;
}

interface Student {
    Name: string;
    College: string;
    Sex: string;
    Status: number;
}

export const TableTag: FC<AllStudent> = (props) => {

    let items: TabsProps['items'] = [
        {
            key: '1',
            label: `已报名`,
            children: <StudentList Data={props.Data
            } />
        },
        {
            key: '2',
            label: `待审核`,
            children: <StudentList Data={props.Data} />
        },
        {
            key: '3',
            label: `已签到`,
        },
    ];
    return <><Tabs defaultActiveKey="1" items={items} onChange={onChange} /></>

}