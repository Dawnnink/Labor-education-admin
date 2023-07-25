import React, { FC } from 'react';
import { IAdActivity } from '~/pages/Check/CheckTable';
import { Box } from '@mui/material'
import style from './index.module.css'
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
export interface IReadOnlyEditor {
    initialActivity: IAdActivity
    canPass: boolean
    canReject: boolean
}
export const ReadOnlyEditor: FC<IReadOnlyEditor> = (
    props
) => {

    const { RangePicker } = DatePicker;
    const { TextArea } = Input;


    return (
        <div className='entire'>
            <div className={style.form}>
                <Form
                    initialValues={props.initialActivity}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 10 }}
                    layout='horizontal'
                    style={{
                        maxWidth: "100%",
                    }}
                    aria-readonly
                    requiredMark={true}
                >
                    <Form.Item
                        label='活动名称'
                        name='name'
                        required
                        tooltip={{ title: '填写活动名称', icon: <InfoCircleOutlined /> }}
                    >
                        <Input
                        // onChange={(e) => { handleName(e) }}
                        />
                    </Form.Item>
                    <Form.Item

                        label="活动简介"
                        required
                        name="description"
                    >
                        <TextArea
                            // onChange={(e) => { handleDes(e) }}
                            rows={4}
                        />
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

                                    >
                                        {props.initialActivity.poster != undefined && props.initialActivity.poster.length > 3 ?
                                            <img src={props.initialActivity.poster} alt=" " style={{ width: '100%' }} className={style.img} /> : null
                                        }
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

                                    >
                                        {props.initialActivity.icon != undefined && props.initialActivity.icon.length > 3 ?
                                            <img src={props.initialActivity.icon} alt=" " style={{ width: '100%' }} className={style.img} /> : null
                                        }                  </Upload>
                                </div>

                            </Form.Item>
                        </div>
                    </Form.Item>

                    {/* </Form> */}
                    <Form.Item
                        label='活动地点'

                        name='position'
                        required
                        tooltip={{ title: 'Tooltip with customize icon', icon: <InfoCircleOutlined /> }}
                    >
                        <Input />
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
                                style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
                            >
                                <Input
                                    prefix={<UserOutlined className="site-form-item-icon" />}

                                />
                            </Form.Item>
                            <Form.Item colon={false} name='contact_phone_number'

                            >
                                <Input
                                    prefix={<PhoneOutlined />}
                                />
                            </Form.Item>

                        </div>
                    </Form.Item>
                    <Form.Item
                        label='发布部门'
                        required
                        name="department"
                        wrapperCol={{ span: 5 }}

                    >
                        <Select
                            placeholder='请选择'

                        />
                    </Form.Item>
                    <Form.Item
                        label='报名时间'
                        required
                        name="registerAt"
                        wrapperCol={{ span: 10 }}

                    >
                        <RangePicker
                            showTime
                            format='YYYY-MM-DD HH:mm'

                        />

                    </Form.Item>
                    <Form.Item

                        label='活动时间'
                        name='joinAt'
                        required
                        wrapperCol={{ span: 10 }}
                    >
                        <RangePicker
                            showTime
                            format='YYYY-MM-DD HH:mm'
                        />
                    </Form.Item>
                    <Form.Item
                        required
                        label="活动名额"

                    >
                        <Form.Item
                            name="quota"
                            noStyle
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
                            <Button
                                type='primary'
                            >
                                审核通过
                            </Button>
                            <Button
                                danger
                            >
                                打回
                            </Button>
                        </Space>
                    </Form.Item>
                </Form >
            </div >
        </div >
    )
}