import { Vue, Component } from "vue-property-decorator";
// import { Log } from '@idg/idg';
// import { clearCachedPermissions } from '@idg/acl';
import _ from "lodash";
import {
  Select,
  Option,
  Form,
  FormItem,
  Input,
  Button,
  Checkbox,
} from "@idg/iview";
import styles from "./style.module.less";
// const TAG = 'app/SignInPage';
// import { ResetApi } from '@idg/account';
@Component({
  depends: [
    "api.doatnnuotjlwbh6r83jed1m7yvwrps5q.reset.ResetApi",
    "component.LoginHeaderLayout",
  ],
})
export default class ResetPasswordPage extends Vue {
  private resetApi: any;
  curLang: "zh" | "en" = "zh";
  formData: {
    [prop: string]: string;
  } = {
    phone: "",
    password: "",
    captcha: "",
    passwdCheck: "",
  };
  ruleInline: any = {
    phone: [
      {
        required: true,
        message: this.$l(this.$l(this.$l(this.$l("请输入手机号")))),
        trigger: "blur",
      },
      {
        type: "string",
        pattern: /^1[3456789]\d{9}$/,
        message: this.$l(this.$l(this.$l(this.$l("手机号格式错误")))),
        trigger: "blur",
      },
    ],
    captcha: [
      {
        required: true,
        message: this.$l(this.$l(this.$l(this.$l("请输入验证码")))),
        trigger: "blur",
      },
      {
        type: "string",
        len: 4,
        message: this.$l(this.$l(this.$l(this.$l("验证码格式错误")))),
        trigger: "blur",
      },
    ],
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
    passwdCheck: [
      {
        validator: this.validatePassCheck,
        trigger: "blur",
      },
    ],
  };
  loading: boolean = false;
  captchaTime: number = 0;
  intervalId: number = 0;
  passwordType: string = "text";
  public async created() {
    // 判断是否登录
    if (await this.$app.auth.getToken()) {
      this.$router.push({
        name: "team-project-list",
      });
    }
    // const captchaTime = this.$idg.storage.getItem('captchaTime');
    // const left = this.getTimestamp() - captchaTime;
    // if (captchaTime && left < 60) {
    //   this.captchaTime = left;
    //   this.startCoutdown();
    // } else {
    //   this.$idg.storage.setItem('captchaTime', '');
    // }
  }

  validatePassCheck(rule, value, callback) {
    if (value === "") {
      callback(new Error(this.$l(this.$l(this.$l(this.$l("请再次输入密码"))))));
    } else if (value !== this.formData.password) {
      callback(
        new Error(
          this.$l(this.$l(this.$l(this.$l("输入的密码不一致，请修改后重试"))))
        )
      );
    } else {
      callback();
    }
  }

  // handlePasswordChange() {
  //   this.checkPassword();
  //   if (this.formData.confirmPassword) {
  //     this.checkConfirmPassword();
  //   }
  // }
  async handleCaptchaClick() {
    if (this.captchaTime) {
      return;
    }
    (this.$refs["formInline"] as Form).validateField(
      "phone",
      async (valid: any) => {
        if (!valid) {
          try {
            // this.captchaTime = 60;
            await this.resetApi.sendPhoneCaptcha(this.formData.phone);
            this.$Message.success(
              this.$l(this.$l(this.$l(this.$l(this.$l("发送成功")))))
            );
            this.captchaTime = 60;
            this.startCoutdown();
            await this.$idg.storage.setItem("captchaTime", this.captchaTime);
          } catch (e) {
            this.$Message.error(e.message);
          }
        } else {
          this.$Message.error(valid);
        }
      }
    );
  }

  // getTimestamp() {
  //   return Date.parse(new Date()) / 1000;
  // }
  startCoutdown() {
    this.intervalId = setInterval(() => {
      this.captchaTime--;
      if (this.captchaTime <= 0) {
        clearInterval(this.intervalId);
        this.captchaTime = 0;
      }
    }, 1000);
  }
  goLogin() {
    this.$router.push({
      name: "team-login",
    });
  }
  handleSubmit(name) {
    (this.$refs[name] as Form).validate(async (valid) => {
      if (valid) {
        try {
          this.loading = true;
          const res = await this.resetApi.changePassword(
            this.formData.phone,
            this.formData.captcha,
            this.formData.password,
            this.formData.passwdCheck
          );
          this.$Message.success(
            this.$l(this.$l(this.$l(this.$l("密码重置成功"))))
          );
          // this.goLogin();
        } catch (e) {
          this.$Message.error(e && e.message);
        }
        this.loading = false;
      } else {
        // this.$Message.error('Fail!');
      }
    });
  }
  public render() {
    const { curLang, formData, ruleInline, handleSubmit } = this;
    return (
      <div class={[styles["loginContainer"], styles["signInContainer"]]}>
        <login-header-layout></login-header-layout>
        <main>
          <div class={styles["contentBox"]}>
            <img
              src={require("../../assets/imgs/插画@2x.png")}
              class={styles["asideImg"]}
            ></img>
            <div class={styles["loginWrapper"]}>
              <div class={styles["lang"]}>
                <Select
                  class={styles["langSelect"]}
                  v-model={curLang}
                  style={{}}
                >
                  <i-option value={"zh"}>
                    {this.$l(this.$l(this.$l(this.$l("简体中文"))))}
                  </i-option>
                  {/* <i-option value={'en'}>ENGLISH</i-option> */}
                </Select>
              </div>
              <div class={styles["loginTitle"]}>
                {this.$l(this.$l(this.$l(this.$l("重置密码"))))}
              </div>
              <Form
                name="sadfas"
                class={styles["form"]}
                ref="formInline"
                value={formData}
                rules={ruleInline}
                autocomplete="off"
              >
                <input
                  type="password"
                  style="z-index: -99;position: absolute;"
                />
                <FormItem prop="phone">
                  <Input
                    size="large"
                    type="text"
                    v-model={formData.phone}
                    placeholder={this.$l(
                      this.$l(this.$l(this.$l("请输入已注册手机号")))
                    )}
                  ></Input>
                </FormItem>
                <FormItem
                  prop="captcha"
                  class={[
                    !!this.captchaTime ? styles["disable"] : "",
                    styles["captcha"],
                  ]}
                >
                  <Input
                    size="large"
                    type="text"
                    v-model={formData.captcha}
                    placeholder={this.$l(this.$l(this.$l(this.$l("验证码"))))}
                  >
                    <span slot="append">
                      <Button
                        onClick={() => {
                          this.handleCaptchaClick();
                        }}
                        type="primary"
                      >
                        {this.captchaTime
                          ? `${this.captchaTime}S`
                          : `获取验证码`}
                      </Button>
                    </span>
                  </Input>
                </FormItem>

                <FormItem prop="password">
                  <Input
                    size="large"
                    type="password"
                    v-model={formData.password}
                    placeholder={this.$l(
                      this.$l(this.$l(this.$l("请输入新密码")))
                    )}
                  ></Input>
                </FormItem>

                <FormItem prop="passwdCheck">
                  <Input
                    size="large"
                    type="password"
                    v-model={formData.passwdCheck}
                    placeholder={this.$l(
                      this.$l(this.$l(this.$l("请确认密码")))
                    )}
                  ></Input>
                </FormItem>
                {/*
                 <FormItem>
                  <div class={styles['clause']}>
                    <span>点击注册表明您已阅读同意</span>
                    <a href='https://orang.cloud/nav/term' target='_blank'>
                      《服务条款》
                    </a>
                  </div>
                 </FormItem> */}
                <FormItem style="margin-top: 40px">
                  <Button
                    type="primary"
                    size="large"
                    long
                    onClick={() => {
                      handleSubmit("formInline");
                    }}
                    loading={this.loading}
                  >
                    {this.$l(this.$l(this.$l(this.$l("重置密码"))))}
                  </Button>
                </FormItem>
              </Form>

              <div class={styles["register"]}>
                <span class={styles["desc"]}>
                  {this.$l(this.$l(this.$l(this.$l("已有账号？"))))}
                </span>

                <a
                  onClick={() => {
                    this.goLogin();
                  }}
                >
                  {this.$l(this.$l(this.$l(this.$l("点击登录"))))}
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}
