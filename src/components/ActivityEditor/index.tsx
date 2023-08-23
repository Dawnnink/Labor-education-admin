import { useCallback, useState, useEffect, useMemo } from 'react';
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
import { Activity, Department } from '~/utils/types'
import { network } from '~/utils/network'
import onOrigin from '~/utils/FormOrigin';
import { IIN } from '~/utils/hooks/getActivity';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 导入你所需的日期语言包
import customParseFormat from 'dayjs/plugin/customParseFormat';
import OnFinish from '~/utils/FormFinish';
import { compareDates } from '~/utils/hooks/getActivity';
import OnUpdate from '~/utils/FormUpdate';
dayjs.extend(customParseFormat);

function formatTime(timeString: string): string {
  const inputDate = new Date(timeString);
  const year = inputDate.getUTCFullYear().toString().padStart(4, '0');
  const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = inputDate.getUTCDate().toString().padStart(2, '0');
  const hours = inputDate.getUTCHours().toString().padStart(2, '0');
  const minutes = inputDate.getUTCMinutes().toString().padStart(2, '0');
  const seconds = inputDate.getUTCSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
export interface ActivityEditorProps {
  initialActivity: Activity | null
  disabled?: boolean
  isShow: boolean
  isDel?: boolean
  isDraft?: boolean
  beginDel?: boolean
}
export interface OldActivity {
  name: string
  department_id: number
  description: string
  poster: string
  registerAt: [
    registration_start_time: string | null,
    registration_end_time: string | null,
  ]
  joinAt: [
    activity_start_time: string | null,
    activity_end_time: string | null,
  ]
  quota: number
  need_audit: boolean//是否需要审核
  need_checkout: boolean//是否需要签退
  position: string;
  icon: string
}

export const ActivityEditor = ({
  initialActivity,
  disabled,
  isShow,
  isDel,
  isDraft,
  beginDel,
}: ActivityEditorProps) => {

  const { data: department } = network.teacher.useDepartment()
  const changedActivity = onOrigin(initialActivity, department as Department[])
  if (changedActivity && initialActivity) {
    delete changedActivity.registerAt;
    delete changedActivity.joinAt;
    changedActivity.registerAt = []
    changedActivity.registerAt.push(dayjs(formatTime(initialActivity.registration_start_time)))
    changedActivity.registerAt.push(dayjs(formatTime(initialActivity.registration_end_time)))
    changedActivity.joinAt = []
    changedActivity.joinAt.push(dayjs(formatTime(initialActivity.activity_start_time)))
    changedActivity.joinAt.push(dayjs(formatTime(initialActivity.activity_end_time)))
  }
  const { RangePicker } = DatePicker;
  const { TextArea } = Input;

  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(changedActivity.poster);
  const [iconUrl, setIconUrl] = useState<string>(changedActivity.icon);

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
      message.error('图片大小必须小于1MB!');
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
    const url: string = await network.uploadImage(file)
    setImageUrl(url);
  }
  const handleUploadR = async (options: any) => {
    const { file } = options;
    const url: string = await network.uploadImage(file)
    setIconUrl(url);
  }
  //控制上传图片


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
  const handleDelete = () => {
    const params: string = window.location.pathname;

    const regex = /\/(\d+)$/;
    const match = params.match(regex);

    const Id = match ? match[1] : null;
    if (Id) {
      //如果Id存在则为待报名
      network.teacher.delActivities(parseInt(Id))
        .then(response => {
          if (response.status === 200) {
            message.info("已删除该活动");
            Navigate("/activities");
            setTimeout(() => location.reload(), 1000)
          }
        })
        .catch(() => {
          message.warning("删除活动失败")
        });
    } else if (Id === null) {
      localStorage.removeItem('activity')
      message.info("已删除该活动")
      Navigate('/activities')
      setTimeout(() => location.reload(), 1000)
    }

  }
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

  const isChange = useMemo(() => {
    console.log('之类', changedActivity)
    //主要是获取一下现在的时间，然后如果是在活动开始之前那么就可以更改活动的信息
    if (changedActivity.joinAt && changedActivity.registerAt) {
      if (dayjs().isBefore(dayjs(changedActivity.joinAt[0]))) {
        // 首先确保是在活动开始之前
        if (dayjs().isBefore(dayjs(changedActivity.registerAt[0]))) {
          //如果是在活动报名开始之前
          return 0;
        } else if (dayjs().isBefore(dayjs(changedActivity.registerAt[1])) && dayjs().isAfter(dayjs(changedActivity.registerAt[0]))) {
          //如果实在活动报名时间内
          return 1;
        } else if (dayjs().isBefore(dayjs(changedActivity.joinAt[0])) && dayjs().isAfter(dayjs(changedActivity.registerAt[1]))) {                //如果是在
          //如果是在报名结束时间到活动开始之前的范围内
          return 2;
        }
      }
      else return 3;
    }

  }, [])
  const handleDate = useCallback(() => {


    //下面是对假设就是说活动在各个时间线对于活动的日期更改
    //如果isChange===0
    //这是报名时间段之前，四个时间段都可以更改
    if (isChange === 1) {
      //这是报名时间之内，只能修改报名结束时间
      //首先拿到修改之后的活动报名结束时间，不能早于当前修改活动的时间
      const registerEndTime = form.getFieldValue('registerAt')[1]
      const registerStartTime = form.getFieldValue('registerAt')[0]
      const originRegisterStartTime = changedActivity.registerAt[0];//拿到活动原本的报名开始时间
      //首先判断更改后的报名日期是否与之前相同
      if (!dayjs(registerStartTime).isSame(dayjs(originRegisterStartTime), 'minute')) {
        //以分钟为精度来比较两个时间是否相同
        form.setFieldValue('registerAt', [dayjs(originRegisterStartTime), dayjs().add(1, 'day')])
        message.error('不可修改报名活动时间')
        return;
      }

      if (dayjs(registerEndTime).isBefore(dayjs())) {
        form.setFieldValue('registerAt', [dayjs(originRegisterStartTime), dayjs().add(1, 'day')]);
        message.error('修改后的报名结束时间不能早于当前时间')
      }
    }
    if (form.getFieldValue('registerAt') && isChange !== 1) {
      if (dayjs().isAfter(form.getFieldValue('registerAt')[0])) {
        form.setFieldValue('registerAt', '')
        message.info("活动报名开始时间不能早于目前时间")
      }
    }
    if (form.getFieldValue('joinAt')) {
      if (dayjs().isAfter(form.getFieldValue('joinAt')[0])) {
        form.setFieldValue('joinAt', '')
        message.info("活动开始时间不能早于目前时间")
      }
    }
    if (form.getFieldValue('registerAt') && form.getFieldValue('joinAt')) {
      if (compareDates(form.getFieldValue('registerAt')[1].$d, form.getFieldValue('joinAt')[0].$d) > 0) {
        message.info("活动报名结束时间不能晚于活动开始时间")
        form.setFieldValue('joinAt', '')
      }
    }

  }, [])
  // 本地保存数据
  const handleLocal = () => {
    if (form.getFieldValue('registerAt') == undefined || form.getFieldValue('joinAt') == undefined) {
      message.info('报名时间和活动时间是必填字段')
      return
    }
    const value = form.getFieldsValue();

    const initialState: IIN | Activity = {
      reason: '',
      name: value.name ? value.name : ' ',
      description: value.description != undefined ? value.description : '',
      poster: imageUrl != undefined ? imageUrl : null,
      icon: iconUrl != undefined ? iconUrl : null,
      position: value.position != undefined ? value.position : '',
      contact_person: value.contact_person != undefined ? value.contact_person : '',
      contact_phone_number: value.contact_phone_number != undefined ? value.contact_phone_number : '',
      need_audit: value.need_audit != undefined ? value.need_audit : false,
      need_checkout: value.need_checkout != undefined ? value.need_checkout : false,
      quota: value.quota != undefined ? value.quota : 0,
      registration_start_time: value.registerAt != undefined ? value.registerAt[0] : '',
      registration_end_time: value.registerAt != undefined ? value.registerAt[1] : '',
      activity_start_time: value.joinAt != undefined ? value.joinAt[0] : '',
      activity_end_time: value.joinAt != undefined ? value.joinAt[1] : '',
      department_id: value.department_id != undefined ? value.department_id : undefined,
      department: value.department_id != undefined ? value.department_id : undefined,
      state: "未发布",
      id: -1,
      enroll_number: 0,
      participate_number: 0,
    }
    if (localStorage.getItem("activity")) {
      if (confirm("存储库中已有一份草稿，点击确定将会覆盖此份草稿")) {
        localStorage.setItem(`activity`, JSON.stringify(initialState)); // 将值转换为 JSON 字符串并存储在 localStorage 中
        Navigate('/activities')
        message.success("保存成功")
        return;
      } else {
        return;
      }
    }
    localStorage.setItem(`activity`, JSON.stringify(initialState)); // 将值转换为 JSON 字符串并存储在 localStorage 中
    Navigate('/activities')
    message.success("保存成功")
  }
  const handleUpdate = async () => {
    const fieldsValue = form.getFieldsValue()
    if (await OnUpdate(fieldsValue, departments, imageUrl, iconUrl, changedActivity.id, 1)) {
      Navigate('/activities')
      location.reload()
    }
  }
  return (
    <div className='entire'>
      {isShow ? item : null}
      <div className={style.form}>
        <Form
          initialValues={changedActivity}
          onFinish={async (fieldsValue: any) => {
            if (await OnFinish(fieldsValue, departments, imageUrl, iconUrl, isDraft)) {
              Navigate('/activities')
              location.reload()
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
          requiredMark={true}
        >
          <Form.Item
            label='活动名称'
            name='name'
            required
            // tooltip={{ title: '填写活动名称', icon: <InfoCircleOutlined /> }}
            rules={[

              {
                required: true,
                message: "活动名称为必填字段"
              },
              {
                max: 30,
                message: "活动名称不能超过30个字"
              },
            ]}
          >
            <Input
              disabled={disabled}
            // onChange={(e) => { handleName(e) }}
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
              disabled={isChange === 3}              // onChange={(e) => { handleDes(e) }}
              rows={4}
              placeholder='请阐述活动简介' />
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
          <Form.Item label='上传海报' tooltip={{ title: '请上传1MB以内的JPG/PNG格式文件', icon: <InfoCircleOutlined /> }} >

            <div className='up'>
              <Form.Item
                name="poster"
                style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
              >
                <div>
                  <Upload
                    disabled={disabled}
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
                    }
                  </Upload>
                </div>
              </Form.Item>
              <Form.Item
                label="上传图标"  // 指定绑定的值为 'fileList'
                name='icon'
                tooltip={{ title: '请上传1MB以内的JPG/PNG格式文件', icon: <InfoCircleOutlined /> }}

              >
                <div>
                  <Upload
                    disabled={disabled}
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
                    }                  </Upload>
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
          >
            <Input placeholder='请填写活动地点' disabled={isChange === 3} />
            {/* 如果已经过了true,就不能更改了 */}
          </Form.Item>

          <Form.Item
            label='活动联系人'
            required
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
                  disabled={isChange === 3}
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
                  disabled={isChange === 3}
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
              disabled={disabled}
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
              // defaultValue={[dayjs('2023/01/01 00:00', 'YYYY-MM-DD HH:mm'), dayjs('2023/01/01 00:00', 'YYYY-MM-DD HH:mm')]}
              showTime
              format='YYYY-MM-DD HH:mm'
              onChange={() => handleDate()}
              disabled={isChange === 2 || isChange === 3}
            />

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
            style={{
              marginBottom: '0'
            }}
          >
            <RangePicker
              disabled={isChange === 3}
              onChange={() => handleDate()}
              // defaultValue={[dayjs('2023/01/01 00:00', 'YYYY-MM-DD HH:mm'), dayjs('2023/01/01 00:00', 'YYYY-MM-DD HH:mm')]}
              showTime
              format='YYYY-MM-DD HH:mm'
            />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 10, offset: 4 }} style={{ height: '20px', marginBottom: '10px' }}>
            <span className={style.tips}>
              <Space>
                <InfoCircleOutlined />
                <p style={{ margin: '0' }}>将于活动开始前24小时提醒学生</p>
              </Space>
            </span>
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
              <InputNumber min={changedActivity.quota ? changedActivity.quota : 1} max={2000} disabled={isChange === 3} />
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
            <Radio.Group disabled={disabled}>
              <Radio value={false}>无需审核</Radio>
              <Radio value={true}>需要审核</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="need_checkout"
            label="报名是否需要签退"
            required
            rules={[
              {
                required: true,
                message: "是否需要签退为必填字段"
              }
            ]}
          >
            <Radio.Group disabled={disabled}>
              <Radio value={false}>无需签退</Radio>
              <Radio value={true}>需要签退</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item wrapperCol={{ span: 10, offset: 4 }}>
            <p className={style.tips}>点击"提交审核"后，需要<span>部门审核人</span>通过审核，学生才能看到此活动并报名</p>
          </Form.Item>
          <Form.Item wrapperCol={{ span: 4, offset: 4 }}>
            {
              isChange === 0 || isChange === 1 || isChange === 2 ?
                <Button
                  type="primary"
                  onClick={handleUpdate}
                >
                  更改活动
                </Button>
                :
                <Space>
                  <Button type="primary" htmlType="submit" disabled={disabled}>
                    提交审核
                  </Button>
                  <Button
                    onClick={() => handleLocal()}
                    disabled={disabled}
                  >
                    保存草稿
                  </Button>
                  {
                    isDel ?
                      <Button
                        onClick={() => handleDelete()}
                        danger
                        disabled={!beginDel}
                      >
                        删除活动
                      </Button> :
                      null
                  }
                </Space>
            }
          </Form.Item>
        </Form >
      </div >
    </div >
  )

}
