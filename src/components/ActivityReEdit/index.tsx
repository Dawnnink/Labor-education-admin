import { useState, useEffect, useCallback } from 'react';
import { compareDates } from '~/utils/hooks/getActivity';
import style from './index.module.css'
import OnUpdate from '~/utils/FormUpdate';
import dayjs from 'dayjs';
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
    Modal
} from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useNavigate } from 'react-router-dom'
import { Activity } from '~/utils/types'
import { NewActivity, network } from '~/utils/network'
import { IIN } from '~/utils/hooks/getActivity';
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
    const [openModal, setOpenModal] = useState(true);
    const handleOk = () => {

        setOpenModal(false);
    }
    const handleCancel = () => {

        setOpenModal(false);
    }

    const [activity, setActivity] = useState<Activity | NewActivity>(
        initialActivity ?? {
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
            department_id: 0,
            reason: '',
        }
    )
    console.log(activity)

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setActivity({
            ...activity,
            name: e.target.value
        })
    }

    const { RangePicker } = DatePicker;
    const { TextArea } = Input;

    const getBase64 = useCallback((img: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    }, []);

    const beforeUpload = useCallback((file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只能上传格式类型为JPG/PNG的图片');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片大小必须小于2MB!');
        }
        return isJpgOrPng && isLt2M;
    }, []);

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
    const handleDate = useCallback(() => {
        if (form.getFieldValue('registerAt')) {
            if (dayjs().isAfter(form.getFieldValue('registerAt')[0])) {
                form.setFieldValue('registerAt', '')
                message.info("活动报名开始时间不能早于目前时间")
                return false;
            }
        }
        if (form.getFieldValue('registerAt') && form.getFieldValue('joinAt')) {
            if (compareDates(form.getFieldValue('registerAt')[1].$d, form.getFieldValue('joinAt')[0].$d) > 0) {
                message.info("活动报名结束时间不能晚于活动开始时间")
                form.setFieldValue('joinAt', '')
                return false;
            }
        }
        if (form.getFieldValue('registerAt') && form.getFieldValue('joinAt')) {
            if (compareDates(form.getFieldValue('registerAt')[1].$d, form.getFieldValue('joinAt')[0].$d) > 0) {
                message.info("活动报名结束时间不能晚于活动开始时间")
                form.setFieldValue('joinAt', '')
                return false;
            }
        }
    }, [])
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

    const handleLocal = useCallback(() => {
        if (!handleDate()) {
            message.warning("请检查报名时间的格式")
            return;
        }
        if (form.getFieldError('registerAt').length != 0 || form.getFieldError('joinAt').length != 0) {
            message.info('报名时间和活动时间是必填字段')
            console.log(form.getFieldError('joinAt'))
            return;
        }
        const value = form.getFieldsValue();

        const initialState: IIN | Activity = {
            reason: '',
            name: value.name || ' ',
            description: value.description || ' ',
            poster: imageUrl || ' ',
            icon: iconUrl || ' ',
            position: value.position || ' ',
            contact_person: value.contact_person || ' ',
            contact_phone_number: value.contact_phone_number || ' ',
            need_audit: value.need_audit || false,
            quota: value.quota || 0,
            registration_start_time: value.registerAt[0],
            registration_end_time: value.registerAt[1],
            activity_start_time: value.joinAt[0],
            activity_end_time: value.joinAt[1],
            department_id: value.department_id || 0,
            department: value.department_id || " ",
            state: "未发布",
            id: -1,
            enroll_number: 0,
            participate_number: 0,
        }
        console.log(initialState);
        if (localStorage.getItem("activity")) {
            if (confirm("存储库中已有一份草稿，点击确定将会覆盖此份草稿")) {
                localStorage.setItem(`activity`, JSON.stringify(initialState)); // 将值转换为 JSON 字符串并存储在 localStorage 中
                Navigate('/activities')
                message.success("保存成功")
                network.teacher.delActivities(id)
                setTimeout(() => {
                    location.reload()
                }, 2000)
                return;
            } else {
                return;
            }
        }
        localStorage.setItem(`activity`, JSON.stringify(initialState)); // 将值转换为 JSON 字符串并存储在 localStorage 中
        Navigate('/activities')
        message.success("保存成功")// 将值转换为 JSON 字符串并存储在 localStorage 中
        network.teacher.delActivities(id)
        setTimeout(() => {
            location.reload()
        }, 2000)
    }, [])
    //selector  
    const { data: departments } = network.teacher.useDepartment()
    let OPTIONS: string[] = [];

    (departments === undefined) ? OPTIONS = ['无数据'] : OPTIONS = OPTIONS.concat(departments.map((item) => item.name));



    return (
        <div className='entire'>
            <Modal open={openModal} onOk={handleOk} onCancel={handleCancel}>
                <p>{activity.reason}</p>
            </Modal>
            {isShow ? item : null}
            <div className={style.form}>
                <Form
                    initialValues={activity}
                    onFinish={async (fieldsValue: any) => {
                        if (await OnUpdate(fieldsValue, departments, imageUrl, iconUrl, id)) {
                            Navigate('/activities')
                        }
                    }
                    }
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
                                max: 30,
                                message: "活动名称不能超过30个字"
                            },
                            {
                                required: true,
                                message: "活动名称为必填字段"
                            }
                        ]}
                    >
                        <Input
                            onChange={(e) => { handleInput(e) }}
                        />
                    </Form.Item>
                    <Form.Item
                        rules={[
                            {
                                max: 250,
                                message: "活动简介不能超过250个字",
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
                                        {imageUrl != undefined && imageUrl.length > 3 ?
                                            <img src={imageUrl} alt=" " style={{ width: '100%' }} className={style.img} /> : uploadButton
                                        }                                    </Upload>
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
                                        {iconUrl != undefined && iconUrl.length > 3 ?
                                            <img src={iconUrl} alt=" " style={{ width: '100%' }} className={style.img} /> : upLoadBtn
                                        }                                           </Upload>
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
                                max: 20,
                                message: "活动地点不能超过20个字"
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
                                        message: "活动联系人不能超过50个字"
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
                                        pattern: /^1[3456789]\d{9}$/,
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
                        wrapperCol={{ span: 10 }}
                        rules={[
                            {
                                required: true,
                                message: "报名时间为必填字段"
                            }
                        ]}
                    >
                        <RangePicker
                            onChange={() => handleDate()}
                            showTime format='YYYY-MM-DD HH:mm' />
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
                        wrapperCol={{ span: 10 }}
                    >
                        <RangePicker
                            onChange={() => handleDate()}
                            showTime format='YYYY-MM-DD HH:mm' />
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
                        <Space>
                            <Button type="primary" htmlType="submit">
                                提交审核
                            </Button>
                            <Button
                                onClick={() => handleLocal()}                            >
                                保存草稿
                            </Button>
                            <Button
                                danger
                                onClick={() => {
                                    console.log(id)
                                    network.teacher.delActivities(id)
                                        .then(response => {
                                            if (response.status === 200) {
                                                message.info("已删除该活动");
                                                Navigate("/activities");
                                            }
                                        })
                                        .catch(error => {
                                            message.info("删除活动失败", error)
                                        });

                                }
                                }
                            >
                                删除活动
                            </Button>
                        </Space>

                    </Form.Item>
                </Form >
            </div >
        </div >
    )

}
