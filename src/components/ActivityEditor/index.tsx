import React, { useState, useEffect } from 'react';
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
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useNavigate } from 'react-router-dom'
import { Activity } from '~/utils/types'
import { NewActivity, network } from '~/utils/network'
import onFinish from '~/utils/FormFinish';
export interface ActivityEditorProps {
  initialActivity: Activity | null
  disabled?: boolean
}

export const ActivityEditor = ({
  initialActivity,
}: ActivityEditorProps) => {
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
    }
  )

  const handlePosterChange = (options: any) => {
    const { file } = options; setActivity((prevActivity) => ({
      ...prevActivity,
      poster: file.name ?? "",
    }))
  }
  const handleIconChange = (options: any) => {
    const { file } = options;
    setActivity((prevActivity) => ({
      ...prevActivity,
      icon: file.name ?? "",
    }))
  }
  const handleName = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setActivity({ ...activity, name: value })
  }
  const handleDes = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    console.log(value)
    setActivity({ ...activity, description: value })
  }

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
  const [imageUrl, setImageUrl] = useState<string>();
  const [iconUrl, setIconUrl] = useState<string>();
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
      {item}
      <div className={style.form}>
        <Form
          onFinish={(fieldsValue: any) => onFinish(fieldsValue, departments, imageUrl, iconUrl)}
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 10 }}
          layout='horizontal'
          style={{
            maxWidth: "100%",
          }}
          requiredMark={true}
        >
          <Form.Item
            label='活动名称'
            name='name'
            required
            tooltip={{ title: '填写活动名称', icon: <InfoCircleOutlined /> }}
          >
            <Input
              onChange={(e) => { handleName(e) }}
            />
          </Form.Item>
          <Form.Item
            label="活动简介"
            required
            name="description"
          >
            <TextArea
              onChange={(e) => { handleDes(e) }}
              rows={4}
              placeholder='Please enter your work goals' />
          </Form.Item>
          {/* <Form

                  layout='inline'
                  name="horizontal_login"
                  style={{
                      width: '58%',
                      display: "flex",
                      gap: "57px",
                      flexDirection: "row",
                      paddingLeft: "13.8%",
                  }}
              > */}
          <Form.Item label='上传海报' >

            <div className='up'>
              <Form.Item
                name="poster"
                style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
              >
                <div>
                  <Upload
                    className=' avatar-uploader'
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={(options) => {
                      handleChangeL(options);
                      handlePosterChange(options);
                    }}
                    customRequest={handleUploadL}
                  >
                    {imageUrl ? <img src={imageUrl} alt="" style={{ width: '100%' }} /> : uploadButton}
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
                      handleIconChange(options);
                    }}
                    customRequest={handleUploadR}
                  >
                    {iconUrl ? <img src={iconUrl} alt="" style={{ width: '100%' }} /> : upLoadBtn}
                  </Upload>
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
                style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
              >
                <Input
                  placeholder='请输入联系人姓名'
                  prefix={<UserOutlined className="site-form-item-icon" />}

                />
              </Form.Item>
              <Form.Item colon={false} name='contact_phone_number'>
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
          >
            <RangePicker showTime format='YYYY-MM-DD HH:mm' />
          </Form.Item>
          <Form.Item
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
            <Form.Item name="quota" noStyle>
              <InputNumber min={1} max={200} />
            </Form.Item>
            <span className="ant-form-text" style={{ marginLeft: 8 }}>
              人
            </span>
          </Form.Item>
          <Form.Item name="need_audit" label="报名是否需要审核" required>
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
              <Button>保存草稿</Button>
            </Space>
          </Form.Item>
        </Form >
      </div >
    </div >
  )

}
