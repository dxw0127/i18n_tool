import { Component, Vue } from "vue-property-decorator";
import { Select, Option, Form, FormItem, Input, Button } from "@idg/iview";
import styles from "./style.module.less";
import { UserApi } from "@idg/ucenter";
import { Log, Locales } from "@idg/idg";
import { store } from "../../store/index";
@Component({
  depends: [
    "component.ole8vcm1jivxzjywstgh9kfror2qa3d7.upload.Upload",
    "api.sihpkp4z3rg7wvsozr5lkta9nxxiocqj.user.UserApi",
    "api.4bocnj6ipkl8nw0x3rfgzlqyuvckjx5e.address.AddressApi",
  ],
})
export default class UserInfo extends Vue {
  private userApi: UserApi;
  private addressApi: any;
  curSetting: string = "userInfo";
  formInline: {
    [prop: string]: string;
  } = {
    name: "",
    email: "",
    phone: "",
    region: "",
    avatar: "",
  };
  ruleInline: any = {
    name: [
      {
        required: true,
        message: this.$l(this.$l(this.$l(this.$l("请输入用户名")))),
        trigger: "blur",
      },
    ],
    email: [
      {
        type: "string",
        pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        message: this.$l(this.$l(this.$l(this.$l("邮箱格式错误")))),
        trigger: "blur",
      },
    ],
  };
  regionList: any = [];
  isEdit: boolean = false;
  regionCode: string = "";
  saveLoading: boolean = false;
  public uploadLoading: boolean = false;
  get curRegionLabel() {
    const region = this.regionList.find((item) => {
      return item.district_id === this.regionCode;
    });
    if (!region) {
      return;
    }
    return region.name;
  }
  public created() {
    this.getUserInfo();
    this.remoteFetchDistricts();
  }
  public async getUserInfo(isSync?: boolean) {
    const { formInline } = this;
    const userInfo = await this.userApi.getCurrentUser();
    const bindInfo = await this.$idg.storage.getItem("bindInfo");
    const { avatar_url, email, address, name } = userInfo;
    formInline.name = name;
    formInline.avatar = avatar_url;
    formInline.email = email;
    this.regionCode = address;
    // formInline.region = city_code;
    formInline.phone = (bindInfo as any).phone;
    if (isSync) {
      store.setUserInf(userInfo);
    }
  }
  async remoteFetchDistricts() {
    try {
      const locales = {
        "zh-CN": "zh-cn",
        "en-US": "en",
      };
      const language = Locales.getLanguage();
      const districts = await this.addressApi.fetchDistrict({
        id: [0],
        depth: 0,
        locale: locales[language] || "zh-cn",
      });
      console.log(
        "UserInfo ---> remoteFetchDistricts ---> districts",
        districts
      );
      this.regionList = districts.filter((item) => !!item.name);
      // this.onLoaded(districts);
      // this.cascaderItems = this.getDistricts(districts);
    } catch (e) {
      this.$Message.error(e.message);
    }
  }
  handleEdit(name) {
    this.isEdit = true;
  }
  handleSaveInfo(name) {
    (this.$refs[name] as Form).validate(async (valid) => {
      if (valid) {
        this.saveLoading = true;
        try {
          const { avatar, name, email, region } = this.formInline;
          const accountId = await this.$app.auth.getAccountId();
          await this.userApi.updateUser({
            account_id: accountId,
            avatar_url: avatar,
            email: email,
            address: region,
            name: name,
          });
          this.$Message.success(
            this.$l(this.$l(this.$l(this.$l("保存成功!"))))
          );
          await this.getUserInfo(true);
          this.isEdit = false;
        } catch (error) {
          this.$Message.error(error.message);
        } finally {
          this.saveLoading = false;
        }
      } else {
        // this.$Message.error('Fail!');
      }
    });
  }

  // 上传之前调用
  public beforeUpload() {
    this.uploadLoading = true;
    return true;
  }

  // 上传成功
  public onSuccessHandle(res: any[]) {
    console.log("UserInfo ---> onSuccessHandle ---> res", res);
    this.formInline.avatar = res[0].url;
    this.uploadLoading = false;
  }

  // 上传失败
  public onErrorHandle() {
    this.uploadLoading = false;
    this.$Message.error(this.$l(this.$l(this.$l(this.$l("上传图片失败！")))));
  }
  public render() {
    const { formInline, ruleInline } = this;
    return (
      <div class={styles["userInfoContainer"]}>
        <Form
          class={styles["form"]}
          ref="formInline"
          value={formInline}
          rules={ruleInline}
          label-position="top"
        >
          <div class={styles["formLeft"]}>
            <FormItem
              prop="name"
              label={this.$l(this.$l(this.$l(this.$l("姓名"))))}
            >
              <Input
                disabled={!this.isEdit}
                type="text"
                v-model={formInline.name}
                placeholder={this.$l(
                  this.$l(this.$l(this.$l("请输入您的名字")))
                )}
              ></Input>
            </FormItem>
            {/* <FormItem prop='familyName' label='姓'>
              <Input type='password' v-model={formInline.familyName} placeholder='请输入您的姓'></Input>
             </FormItem> */}

            <FormItem
              prop="email"
              label={this.$l(this.$l(this.$l(this.$l("电子邮箱"))))}
            >
              <Input
                disabled={!this.isEdit}
                type="text"
                v-model={formInline.email}
                placeholder={this.$l(
                  this.$l(this.$l(this.$l("请输入电子邮箱")))
                )}
              ></Input>
            </FormItem>
            <FormItem label={this.$l(this.$l(this.$l(this.$l("手机号码"))))}>
              <Input
                type="text"
                disabled
                v-model={formInline.phone}
                placeholder={this.$l(
                  this.$l(this.$l(this.$l("请输入手机号码")))
                )}
              ></Input>
            </FormItem>

            <FormItem label="所在国家/地区">
              <Select
                transfer={true}
                disabled={!this.isEdit}
                on-on-change={(value) => {
                  formInline.region = value;
                }}
                placeholder={this.curRegionLabel}
              >
                {this.regionList.map((item) => {
                  return (
                    <Option value={item.district_id} key={item.district_id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </FormItem>
          </div>

          <FormItem label={this.$l(this.$l(this.$l(this.$l("头像"))))}>
            <div class={styles["formItemAvatar"]}>
              <img
                class={styles["avatar"]}
                src={
                  this.formInline.avatar
                    ? this.formInline.avatar
                    : require("../../assets/imgs/default-avatar.svg")
                }
                alt="avatar"
              />
              {this.isEdit && (
                <upload
                  action
                  max-size={2048}
                  accept=".png,.jpeg,.jpg,.svg"
                  show-upload-list={false}
                  props={{
                    "before-upload": this.beforeUpload,
                    "on-success": this.onSuccessHandle,
                    "on-error": this.onErrorHandle,
                  }}
                >
                  <div class={styles["uploadWrapper"]}>
                    <img src={require("../../assets/imgs/upload.svg")} alt="" />
                    <span>
                      {this.$l(this.$l(this.$l(this.$l("上传文件"))))}
                    </span>
                  </div>
                </upload>
              )}

              <div class={styles["uploadTip"]}>
                真实的头像可以让您的伙伴在 零壤ORang 中迅速认出您
              </div>
            </div>
          </FormItem>
        </Form>

        <Button
          class={styles["editBtn"]}
          type="primary"
          loading={this.saveLoading}
          onClick={() => {
            if (this.isEdit) {
              this.handleSaveInfo("formInline");
            } else {
              this.handleEdit("formInline");
            }
          }}
        >
          {this.isEdit ? `保存基本信息` : `编辑信息`}
        </Button>
        {this.isEdit && (
          <Button
            class={styles["cancelBtn"]}
            onClick={() => {
              this.isEdit = false;
            }}
          >
            {this.$l(this.$l(this.$l(this.$l("取消"))))}
          </Button>
        )}
      </div>
    );
  }
}
