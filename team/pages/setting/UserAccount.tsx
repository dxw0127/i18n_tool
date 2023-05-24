import { Component, Vue } from "vue-property-decorator";
import {
  Select,
  Option,
  Form,
  FormItem,
  Input,
  Button,
  Checkbox,
  Icon,
} from "@idg/iview";
import styles from "./style.module.less";
@Component({
  depends: ["api.doatnnuotjlwbh6r83jed1m7yvwrps5q.reset.ResetApi"],
})
export default class UserAccount extends Vue {
  private resetApi: any;
  curSetting: string = "userInfo";
  formInline: {
    [prop: string]: string;
  } = {
    password: "",
    newPassword: "",
    newPasswordCheck: "",
  };
  ruleInline: any = {
    password: [
      {
        required: true,
        message: this.$l(this.$l(this.$l(this.$l("请输入密码")))),
        trigger: "blur",
      },
      {
        type: "string",
        min: 6,
        message: "密码最少6个字符",
        trigger: "blur",
      },
      {
        type: "string",
        pattern: /^[a-zA-Z0-9_-]+$/,
        message: "密码必须由(大小写字母_-)组成",
        trigger: "blur",
      },
    ],
    newPassword: [
      {
        required: true,
        message: this.$l(this.$l(this.$l(this.$l("请输入新密码")))),
        trigger: "blur",
      },
      {
        type: "string",
        min: 6,
        message: "密码最少6个字符",
        trigger: "blur",
      },
      {
        type: "string",
        pattern: /^[a-zA-Z0-9_-]+$/,
        message: "密码必须由(大小写字母_-)组成",
        trigger: "blur",
      },
    ],
    newPasswordCheck: [
      {
        required: true,
      },
      {
        validator: this.validatePassCheck,
        trigger: "blur",
      },
    ],
  };
  isEdit: boolean = false;
  loading: boolean = false;
  public uploadLoading: boolean = false;
  public created() {
    this.getList();
  }
  public getList() {}
  validatePassCheck(rule, value, callback) {
    if (value === "") {
      callback(
        new Error(this.$l(this.$l(this.$l(this.$l("请再次输入新密码")))))
      );
    } else if (value !== this.formInline.newPassword) {
      callback(
        new Error(
          this.$l(this.$l(this.$l(this.$l("输入的密码不一致，请修改后重试"))))
        )
      );
    } else {
      callback();
    }
  }
  handleSubmit(name) {
    (this.$refs[name] as Form).validate(async (valid) => {
      if (valid) {
        try {
          this.loading = true;
          const bindInfo: any = await this.$idg.storage.getItem("bindInfo");
          const res = await this.resetApi.changePhonePasswordWithOldPassword(
            bindInfo.phone,
            this.formInline.password,
            this.formInline.newPassword,
            this.formInline.newPasswordCheck
          );
          this.isEdit = false;
          // this.$app.auth.clear();
          (this.$refs[name] as Form).resetFields();
          this.$Message.success(this.$l(this.$l(this.$l(this.$l("更新成功")))));

          // this.$router.push({ name: 'team-login' });

          // this.goLogin();
        } catch (e) {
          this.$Message.error(e && e.message);
        }
        this.loading = false;
      } else {
      }
    });
  }
  public render() {
    const { formInline, ruleInline, handleSubmit } = this;
    return (
      <div class={styles["userAccountContainer"]}>
        <div class={styles["title"]}>
          {this.$l(this.$l(this.$l(this.$l("修改密码"))))}
        </div>
        <div class={styles["desc"]}>
          由于您已使用其他服务（微信）注册
          零壤ORang，因此此帐户没有关联的密码。要使用此电子邮件和密码登录，请使用
          零壤ORang 的密码恢复功能设置密码。
        </div>

        <a
          class={styles["modifyBtn"]}
          onClick={() => {
            this.isEdit = true;
          }}
        >
          {this.$l(this.$l(this.$l(this.$l("修改密码"))))}
        </a>

        {this.isEdit && (
          <div class={styles["formArea"]}>
            <Form
              class={styles["form"]}
              ref="formInAccount"
              value={formInline}
              rules={ruleInline}
              label-position="top"
            >
              <Input
                type="password"
                style="position: absolute; z-index: -999;"
              ></Input>
              <FormItem
                prop="password"
                label={this.$l(this.$l(this.$l(this.$l("当前密码"))))}
              >
                <Input
                  type="text"
                  v-model={formInline.password}
                  placeholder={this.$l(
                    this.$l(this.$l(this.$l("请输入当前密码")))
                  )}
                ></Input>
              </FormItem>
              <FormItem
                prop="newPassword"
                label={this.$l(this.$l(this.$l(this.$l("新密码"))))}
              >
                <Input
                  type="password"
                  v-model={formInline.newPassword}
                  placeholder={this.$l(this.$l(this.$l(this.$l("请输入"))))}
                ></Input>
              </FormItem>
              <FormItem
                prop="newPasswordCheck"
                label={this.$l(this.$l(this.$l(this.$l("确认密码"))))}
              >
                <Input
                  type="text"
                  v-model={formInline.newPasswordCheck}
                  placeholder={this.$l(this.$l(this.$l(this.$l("请输入"))))}
                ></Input>
              </FormItem>
            </Form>

            <Button
              class={styles["editBtn"]}
              type="primary"
              loading={this.loading}
              onClick={() => {
                handleSubmit("formInAccount");
              }}
            >
              {this.$l(this.$l(this.$l(this.$l("更新密码"))))}
            </Button>

            <a
              onClick={() => {
                this.$router.push({
                  name: "reset-password",
                });
              }}
            >
              {this.$l(this.$l(this.$l(this.$l("忘记密码"))))}
            </a>
          </div>
        )}
      </div>
    );
  }
}
