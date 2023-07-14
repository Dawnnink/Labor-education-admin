import React, { FC, useState, useEffect } from 'react';
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
import { useStore } from '~/utils/store';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useNavigate } from 'react-router-dom'
import { Activity } from '~/utils/types'
import { NewActivity, network, baseUrl } from '~/utils/network'
export interface ActivityEditorProps {
  initialActivity: Activity | null
  disabled?: boolean
}

export const ActivityEditor = ({
  initialActivity,
  disabled,
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
  // const [quotaString, setQuotaString] = useState<string>(
  //   activity.quota === undefined ? '' : activity.quota.toString()
  // )
  // console.log(quotaString)
  // const [selectedDepartmentId, setSelectedDepartmentId] = useState(
  //   initialActivity?.department_id ?? null
  // )

  // const Input = (props: React.ComponentProps<typeof JoyInput>) => (
  //   <JoyInput disabled={disabled} {...props} />
  // )

  // const theme = useTheme()
  // const underSm = useMediaQuery(theme.breakpoints.down('sm'))

  // const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   if (initialActivity === null) {
  //     network.teacher.createActivity(activity)
  //   } else {
  //     if (!('id' in activity)) {
  //       throw new Error('Expect Activity for updateActivity')
  //     }
  //     network.teacher.updateActivity(activity)
  //   }
  // }
  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const value = e.target.value
  //   console.log(value);

  //   setActivity({ ...activity, name: value, })
  // }

  // const handleQuotaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { value } = e.target
  //   setQuotaString(value)
  //   setActivity((prevActivity) => ({
  //     ...prevActivity,
  //     quota: parseInt(value),
  //   }))
  // }

  // const handleActivityTimeChange = (value: [string, string]) => {
  //   setActivity((prevActivity) => ({
  //     ...prevActivity,
  //     activity_start_time: value[0],
  //     activity_end_time: value[1],
  //   }))
  // }

  // const handleRegistrationTimeChange = (value: [string, string]) => {
  //   setActivity((prevActivity) => ({
  //     ...prevActivity,

  //     registration_start_time: value[0],
  //     registration_end_time: value[1],
  //   }))
  // }

  // const handlePosterChange = (image: string | null) => {
  //   setActivity((prevActivity) => ({
  //     ...prevActivity,
  //     poster: image ?? '',
  //   }))
  // }

  // const handleIconChange = (image: string | null) => {
  //   setActivity((prevActivity) => ({
  //     ...prevActivity,
  //     icon: image ?? '',
  //   }))
  // }


  const { RangePicker } = DatePicker;
  const config = {
    rules: [{ type: 'object' as const, required: true, message: '请选择时间' }]
  }
  const rangeConfig = {
    rules: [{ type: 'array' as const, required: true, message: '请选择时间' }]
  }
  const onFinish = (fieldsValue: any) => {
    const registerValue = fieldsValue['registerAt'];
    const joinValue = fieldsValue['joinAt'];
    const values = {
      ...fieldsValue,
      "registration_start_time":
        registerValue[0].format('YYYY-MM-DDTHH:mm:ss[Z]'),
      'registration_end_time':
        registerValue[1].format('YYYY-MM-DDTHH:mm:ss[Z]'),

      'activity_start_time':
        joinValue[0].format('YYYY-MM-DDTHH:mm:ss[Z]'),
      'activity_end_time':
        joinValue[1].format('YYYY-MM-DDTHH:mm:ss[Z]'),
    }
    delete values.registerAt;
    delete values.joinAt;
    // const calue
    const college = values.department_id;
    console.log(college)
    let index = 0;
    let len = 0;
    departments === undefined ? len = 0 : len = departments.length;
    if (departments === undefined) {
      index = 0;
    } else {
      for (let i = 0; i < len; i++) {
        if (departments[i].name == college) {
          index = departments[i].id;
        }
      }
    }
    values.icon = ' ';
    values.department_id = index;
    values.poster = "url"
    console.log(JSON.stringify(values))
    network.teacher.createActivity(values);
  }
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
    setImageUrl((prevState) => url);
  }
  const handleUploadR = async (options: any) => {
    const { file } = options;
    console.log(file);
    const url: string = await network.uploadImage(file)
    setIconUrl((prevState) => url);
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
      getBase64(info.file.originFileObj as RcFile, (url) => {
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
      getBase64(info.file.originFileObj as RcFile, (url) => {
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
          onFinish={onFinish}
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
                name="poster"  // 指定绑定的值为 'fileList'
                style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
              >
                <Upload
                  className='uploadOne'
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
              </Form.Item>
              <Form.Item
                label="上传图标"
                valuePropName='icon'  // 指定绑定的值为 'fileList'
                name='uploadIcon'>
                <Upload
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
        </Form>
      </div>
    </div>
  )

}

{/* <Stack component="form" onSubmit={handleSubmit} spacing={2}>
<FormControl>
  <FormLabel>活动名称</FormLabel>
  <JoyInput
    disabled={disabled}
    sx={{
      maxWidth: 300,
    }}
    placeholder="请输入活动名称"
    value={activity.name}
    name="name"
    onChange={(e) => handleChange(e)}
  />
</FormControl>
<FormControl>
  <FormLabel>活动简介</FormLabel>
  <Textarea
    disabled={disabled}
    minRows={2}
    sx={{
      maxWidth: 400,
    }}
    placeholder="请输入活动简介"
    value={activity.description}
    name="description"
    onChange={handleChange}
  />
</FormControl>

<Stack direction={underSm ? 'column' : 'row'} spacing={underSm ? 2 : 4}>
  <Stack>
    <FormLabel>活动海报</FormLabel>
    <ImageUploader
      width={300}
      height={150}
      image={activity.poster || null}
      onChange={handlePosterChange}
    />
  </Stack>
  <Stack>
    <FormLabel>活动图标</FormLabel>
    <ImageUploader
      width={150}
      height={150}
      image={activity.icon || null}
      onChange={handleIconChange}
    />
  </Stack>
</Stack>

<Stack>
  <FormLabel>活动联系人</FormLabel>

  <Stack direction={underSm ? 'column' : 'row'} spacing={2}>
    <JoyInput
      placeholder="姓名"
      sx={{ maxWidth: 200 }}
      startDecorator={<PersonIcon />}
      value={activity.contact_person}
      name="contact_person"
      onChange={handleChange}
    />
    <JoyInput
      placeholder="电话"
      sx={{ maxWidth: 200 }}
      startDecorator={<LocalPhoneIcon />}
      type="tel"
      value={activity.contact_phone_number}
      name="contact_phone_number"
      onChange={handleChange}
    />
  </Stack>
</Stack>

<FormControl>
  <FormLabel>活动地点</FormLabel>
  <JoyInput
    startDecorator={<LocationOnIcon />}
    sx={{
      maxWidth: 300,
    }}
    placeholder="请输入活动地点"
    value={activity.position}
    name="position"
    onChange={handleChange}
  />
</FormControl>
<FormControl>
  <FormLabel>发布部门</FormLabel>
  <Autocomplete
    loading={!!departments}
    options={(departments ?? []).map((v) => v.id)}
    sx={{
      maxWidth: 250,
    }}
    placeholder="请选择发布部门"
    value={selectedDepartmentId}
    name="department"
    getOptionLabel={(option) =>
      departments?.find((v) => v.id === option)?.name ?? ''
    }
    onChange={(_, value) => setSelectedDepartmentId(value)}
  />
</FormControl>

<InputDateRange
  label="报名时间"
  dates={[
    activity.registration_start_time,
    activity.registration_end_time,
  ]}
  onChange={handleRegistrationTimeChange}
/>
<InputDateRange
  label="活动时间"
  dates={[activity.activity_start_time, activity.activity_end_time]}
  onChange={handleActivityTimeChange}
/>
<FormControl>
  <FormLabel>活动名额</FormLabel>
  <JoyInput
    type="number"
    sx={{
      width: 140,
    }}
    endDecorator={
      <Stack spacing={1} direction="row">
        <Divider orientation="vertical" />
        <Box>人</Box>
      </Stack>
    }
    value={quotaString}
    onChange={handleQuotaChange}
  />
</FormControl>
<Checkbox
  label="报名需要审核"
  checked={activity?.need_audit || false}
  name="need_audit"
  onChange={handleChange}
/>
<Stack direction="row" spacing={2}>
  {disabled ? null : initialActivity === null ? (
    <Button type="submit" variant="solid">
      创建活动
    </Button>
  ) : (
    <Button type="submit" variant="solid">
      更新活动
    </Button>
  )}
</Stack>
</Stack>
) */}