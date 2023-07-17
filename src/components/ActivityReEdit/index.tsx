import React, { useState, useEffect } from 'react';
import style from './index.module.css'
import onUpdate from '~/utils/FormUpdate';
import {
    InfoCircleOutlined,
    LoadingOutlined,
    PlusOutlined,
    UserOutlined,
    PhoneOutlined,
} from '@ant-design/icons';
import {
    Space,
    Radio,
    InputNumber,
    Button,
    Input,
    Form,
    DatePicker,
    Upload,
    message,
    Select,
} from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useNavigate } from 'react-router-dom'
import { Activity } from '~/utils/types'
import { NewActivity, network } from '~/utils/network'
import onOrigin from '~/utils/FormOrigin';

export interface ActivityEditorProps {
    initialActivity: Activity | null
    disabled?: boolean
    isShow: boolean
    id: number
}
export interface OldActivity {
    name: string
    department_id: string
    description: string
    poster: string
    registerAt: [
        registration_start_time: string,
        registration_end_time: string,
    ]
    joinAt: [
        activity_start_time: string,
        activity_end_time: string,
    ]
    quota: number
    need_audit: boolean
    position: string;
    icon: string

}
export const ActivityReEdit = ({
    initialActivity,
    disabled,
    isShow,
    id
}: ActivityEditorProps) => {
    const changedActivity = onOrigin(initialActivity)
    const [activity, setActivity] = useState<OldActivity | NewActivity>(
        changedActivity ?? {
            name: '',
            description: '',
            poster: '',
            icon: '',
            position: '',
            contact_person: '',
            contact_phone_number: '',
            need_audit: false,
            quota: 0,
            registration_start_time: '',
            registration_end_time: '',
            activity_start_time: '',
            activity_end_time: '',
            department_id: '',
        }
    )


    const { RangePicker } = DatePicker;
    const { TextArea } = Input;

    const getBase64 = (img: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只能上传格式类型为JPG/PNG的图片');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片大小必须小于2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    // export const UponAct: FC = () => {
    //
    const Navigate = useNavigate();
    const [form] = Form.useForm();
    const [, forceUpdate] = useState({});
    useEffect(() => {
        forceUpdate({});
    }, []);

    const handleUploadL = async (options: any) => {
        const { file } = options;
        console.log(file);
        const url: string = await network.uploadImage(file)
        setImageUrl(() => url);
    }
    const handleUploadR = async (options: any) => {
        const { file } = options;
        console.log(file);
        const url: string = await network.uploadImage(file)
        setIconUrl(() => url);
    }
    //控制上传图片
    const [loading, setLoading] = useState(false);
    const [load, setLoad] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>(activity.poster);
    const [iconUrl, setIconUrl] = useState<string>(activity.icon);

    //上传图片
    const handleChangeL: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj as RcFile, () => {
                setLoading(false);
                // setImageUrl(url);
            });
        }
    };
    const handleChangeR: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'uploading') {
            setLoad(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj as RcFile, () => {
                setLoad(false);
                // setImageUrl(url);
            });
        }
    };
    //返回加载中动画
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    const upLoadBtn = (
        <div>
            {load ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    //标题栏
    const item = (
        <div className={style.bigB}>
            <div className={style.smallB1}>
                <span
                    className={style.span1}
                    onClick={() => Navigate("/activities")}

                >活动管理</span>
                <div className={style.span2}>
                    /
                </div>
                <span className={style.span3}>发布活动</span>
            </div>
            <div className={style.smallB2}>
                <div className={style.sP}>发布活动</div>
            </div>
            <div className={style.smallB3}>
                发布活动须知:巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉
            </div>
        </div>
    )
    //selector  
    const { data: departments } = network.teacher.useDepartment()
    let OPTIONS: string[] = [];

    (departments === undefined) ? OPTIONS = ['无数据'] : OPTIONS = OPTIONS.concat(departments.map((item) => item.name));
    return (
        <div className='entire'>
            {isShow ? item : null}
            <div className={style.form}>
                <Form
                    initialValues={activity}
                    onFinish={(fieldsValue: any) => onUpdate(fieldsValue, departments, imageUrl, iconUrl, id)}
                    form={form}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 10 }}
                    layout='horizontal'
                    style={{
                        maxWidth: "100%",
                    }}
                    disabled={disabled
                    } requiredMark={true}
                >
                    <Form.Item
                        label='活动名称'
                        name='name'
                        required
                        tooltip={{ title: '填写活动名称', icon: <InfoCircleOutlined /> }}
                        rules={[
                            {
                                max: 20,
                                message: "活动名称不能超过20个字符"
                            },
                            {
                                required: true,
                                message: "活动名称为必填字段"
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        rules={[
                            {
                                max: 250,
                                message: "活动简介不能超过250个字符",
                            }, {
                                required: true,
                                message: "活动简介为必填字段"
                            }
                        ]}
                        label="活动简介"
                        required
                        name="description"
                    >
                        <TextArea
                            rows={4}
                            placeholder='Please enter your work goals' />
                    </Form.Item>
                    <Form.Item label='上传海报' >

                        <div className='up'>
                            <Form.Item
                                name="poster"
                                style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
                            >
                                <div>
                                    <Upload
                                        className='avatar-uploader'
                                        listType="picture-card"
                                        showUploadList={false}
                                        beforeUpload={beforeUpload}
                                        onChange={(options) => {
                                            handleChangeL(options);
                                            // handlePosterChange(options);
                                        }}
                                        customRequest={handleUploadL}
                                    >
                                        {imageUrl ? <img src={activity.poster || imageUrl} alt=" " style={{ width: '100%' }} className={style.img} /> : uploadButton}
                                    </Upload>
                                </div>
                            </Form.Item>
                            <Form.Item
                                label="上传图标"  // 指定绑定的值为 'fileList'
                                name='icon'
                            >
                                <div>
                                    <Upload
                                        className="avatar-uploader"
                                        listType="picture-card"
                                        showUploadList={false}
                                        beforeUpload={beforeUpload}
                                        onChange={(options) => {
                                            handleChangeR(options);
                                            // handleIconChange(options);
                                        }}
                                        customRequest={handleUploadR}
                                    >
                                        {iconUrl ? <img src={activity.icon || iconUrl} alt=" " style={{ width: '100%' }} className={style.img} /> : upLoadBtn}
                                    </Upload>
                                </div>

                            </Form.Item>
                        </div>
                    </Form.Item>

                    {/* </Form> */}
                    <Form.Item
                        label='活动地点'
                        rules={[
                            {
                                required: true,
                                message: "活动地点为必填字段",
                            },
                            {
                                max: 50,
                                message: "活动地点不能超过50个字段"
                            }
                        ]}
                        name='position'
                        required
                        tooltip={{ title: 'Tooltip with customize icon', icon: <InfoCircleOutlined /> }}
                    >
                        <Input placeholder=' Please describe your customer service, internal customers directly ...' />
                    </Form.Item>

                    <Form.Item
                        label='活动联系人'
                        required

                        tooltip={{ title: 'Tooltip with customize icon', icon: <InfoCircleOutlined /> }}
                    >
                        <div className='contact'>
                            <Form.Item
                                name='contact_person'
                                wrapperCol={{ span: 15 }}
                                rules={[
                                    {
                                        required: true,
                                        message: "活动联系人为必填字段"
                                    },
                                    {
                                        max: 50,
                                        message: "活动联系人不能超过50个字段"
                                    }
                                ]}
                                style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
                            >
                                <Input
                                    placeholder='请输入联系人姓名'
                                    prefix={<UserOutlined className="site-form-item-icon" />}

                                />
                            </Form.Item>
                            <Form.Item colon={false} name='contact_phone_number'
                                rules={[
                                    {
                                        required: true,
                                        message: "联系人电话为必填字段",
                                    }, {
                                        pattern: /^(\+?0?86-?)?1[3-9]\d{9}$/,
                                        message: "请输入正确的手机号格式"
                                    }
                                ]}
                            >
                                <Input
                                    placeholder='请输入联系人电话'
                                    prefix={<PhoneOutlined />}
                                />
                            </Form.Item>

                        </div>
                    </Form.Item>
                    <Form.Item
                        label='发布部门'
                        required
                        name="department_id"
                        wrapperCol={{ span: 5 }}
                        rules={[
                            {
                                required: true,
                                message: "发布部门为必填字段"
                            }
                        ]}
                    >
                        <Select
                            placeholder='请选择'
                            options={OPTIONS.map((item: string) => ({
                                value: item,
                                label: item,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item
                        label='报名时间'
                        required
                        name="registerAt"
                        wrapperCol={{ span: 8 }}
                        rules={[
                            {
                                required: true,
                                message: "报名时间为必填字段"
                            }
                        ]}
                    >
                        <RangePicker showTime format='YYYY-MM-DD HH:mm' />
                    </Form.Item>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: "活动时间为必填字段"
                            }
                        ]}
                        label='活动时间'
                        name='joinAt'
                        required
                        wrapperCol={{ span: 6 }}
                    >
                        <RangePicker showTime format='YYYY-MM-DD HH:mm' />
                    </Form.Item>
                    <Form.Item
                        required
                        label="活动名额"

                    >
                        <Form.Item
                            name="quota"
                            noStyle
                            rules={[
                                {
                                    required: true,
                                    message: "活动名额为必填字段"
                                }
                            ]}
                        >
                            <InputNumber min={1} max={2000} />
                        </Form.Item>
                        <span className="ant-form-text" style={{ marginLeft: 8 }}>
                            人
                        </span>
                    </Form.Item>
                    <Form.Item
                        name="need_audit"
                        label="报名是否需要审核"
                        required
                        rules={[
                            {
                                required: true,
                                message: "报名是否需要审核为必填字段"
                            }
                        ]}
                    >
                        <Radio.Group>
                            <Radio value={false}>无需审核</Radio>
                            <Radio value={true}>需要审核</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item wrapperCol={{ span: 10, offset: 4 }}>
                        <p className={style.tips}>点击"提交审核"后，需要<span>部门审核人</span>通过审核，学生才能看到此活动并报名</p>
                    </Form.Item>
                    <Form.Item wrapperCol={{ span: 4, offset: 4 }}>
                        <Button type="primary" htmlType="submit">
                            再次提交审核
                        </Button>
                    </Form.Item>
                </Form >
            </div >
        </div >
    )

}
