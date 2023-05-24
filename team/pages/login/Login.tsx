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
// const TAG = 'app/TeamLoginPage';
import { LoginApi } from "@idg/account";
import TeamController from "../../controllers/TeamController";
import { Locales } from "@idg/idg";
@Component({
  depends: [
    "api.doatnnuotjlwbh6r83jed1m7yvwrps5q.login.LoginApi",
    "controller.TeamController",
    "component.LoginHeaderLayout",
  ],
})
export default class TeamLoginPage extends Vue {
  private loginApi: any;
  teamController: TeamController;
  public curLang: "zh-CN" | "en-US" = Locales.getLanguage();
  formInline: {
    [prop: string]: string;
  } = {
    phone: "",
    password: "",
  };
  ruleInline: any;
  isRememberPassword: boolean = false;
  showResetPassword: boolean = false;
  showRegister: boolean = false;
  recentUsers = [];
  loginLoading: boolean = false;
  tipMessage: string = "";
  data() {
    return {
      ruleInline: {
        phone: [
          {
            required: true,
            message: this.$l("login.iphonePlaceholder"),
            trigger: "blur",
          },
          {
            type: "string",
            pattern: /^1[3456789]\d{9}$/,
            message: this.$l(this.$l(this.$l(this.$l("账号格式错误")))),
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
        ],
      },
    };
  }

  // enableRegister = !this.$idg.accountServiceOptions.disableRegister

  get searchRecentUsers() {
    if (!this.formInline.phone) {
      return this.recentUsers;
    }
    return this.recentUsers.filter((phone) => {
      return phone.includes(this.formInline.phone);
    });
  }
  public async created() {
    // 判断是否登录
    if (await this.$app.auth.getToken()) {
      this.$router.push({
        name: "team-project-list",
      });
    }
    this.fetch();

    // 全局键盘事件
    document.onkeydown = this.handleKeyDown;

    // 初始化手机号
    if (
      this.recentUsers &&
      this.recentUsers.length > 0 &&
      !this.formInline.phone
    ) {
      this.formInline.phone = this.recentUsers[0].phone;
    }

    // 判断是否重定向到邀请页
  }

  destroyed() {
    document.onkeydown = null;
  }
  async fetch() {
    this.recentUsers = (await this.$idg.storage.getItem("recentUsers")) || [];
  }
  formCheck() {
    if (this.formInline.phone === "") {
      this.tipMessage = this.$l("account.login.tipInputPhone");
      return false;
    } else if (this.formInline.phone.length !== 11) {
      this.tipMessage = this.$l("account.login.tipErrorPhone");
      return false;
    }
    if (this.formInline.password === "") {
      this.tipMessage = this.$l("account.login.tipInputPassword");
      return false;
    } else if (this.formInline.password.length < 6) {
      this.tipMessage = this.$l("account.login.tipErrorPassword");
      return false;
    }
    this.tipMessage = "";
    return true;
  }

  // 保存登录过的用户的手机号
  async saveRecentUsers(phone) {
    if (!phone) {
      return;
    }
    let recentUsers = _.cloneDeep(this.recentUsers);
    recentUsers.unshift(phone);
    recentUsers = _.uniq(recentUsers);
    await this.$app.storage.setItem("recentUsers", recentUsers);
  }

  // 选择最近使用的手机号
  handlePhoneChoose(userPhone) {
    this.formInline.phone = userPhone;
  }

  // 点击重置密码
  handleResetClick() {
    this.showResetPassword = true;
  }

  // 点击注册
  handleRegisterClick() {
    this.showRegister = true;
  }

  // 处理键盘事件
  handleKeyDown(e) {
    if (this.showResetPassword && this.showRegister) {
      return;
    }
    if (e.keyCode === 13 && !this.showResetPassword) {
      this.handleSubmit("formInline");
    }
  }
  // 处理团队信息
  async handleUserTeamInfo(result = {}) {
    // 判断是否重定向到邀请页
    if (this.$route.query.redirectInvite) {
      this.$router.back();
      return;
    }
    const teamInfo = await this.teamController.handleAccountCurTeam();
    // 设置当前用户TeamUuid
    if (teamInfo && teamInfo.team_uuid) {
      await this.$app.storage.setItem("userTeamUuid", teamInfo.team_uuid);
      this.$app.dispatcher.trigger("@idg/account/on-login-success", result);
    } else {
      this.$router.push({
        name: "into-team",
      });
    }

    // console.log(await this.$idg.storage.getItem('userTeamUuid'), 111111111);
  }

  handleSubmit(name) {
    (this.$refs[name] as Form).validate(async (valid) => {
      if (valid) {
        this.loginLoading = true;
        try {
          const result = await this.loginApi.loginByPhone(
            this.formInline.phone,
            this.formInline.password
          );
          await this.saveRecentUsers(this.formInline.phone);
          await this.$app.auth.setToken(result.token);
          await this.$app.auth.setAccountId(result.account_id);
          const bindInfo = await this.loginApi.bindInfo();
          // Log.debug(TAG, 'login bindInfo', bindInfo);
          if (bindInfo && bindInfo.info) {
            // Log.debug(TAG, 'login set bindInfo', bindInfo.info);
            await this.$app.auth.setBindInfo(bindInfo.info);
          }
          // Log.debug(TAG, 'login get bindInfo', this.$app.auth.getBindInfo());
          if (this.isRememberPassword) {
            localStorage.setItem("isRememberPassword", `yes`);
          } else {
            document.cookie = "isRememberPassword=yes";
            localStorage.setItem("isRememberPassword", `no`);
          }
          //登录成功后判断是否有加入团队，如果没有进入创建加入团队页面
          await this.handleUserTeamInfo(result);

          // 登录成功无需提醒
          // this.$Message.success({
          //   content: '登录成功',
          //   duration: 2,
          // });

          this.loginLoading = false;
        } catch (e) {
          this.loginLoading = false;
          this.$Message.error(e.message);
        }
      } else {
        this.$Message.error(
          this.$l(this.$l(this.$l(this.$l("账户名或密码错误，请检查后重试"))))
        );
      }
    });
  }
  changeLocale(value) {
    Locales.setLanguage(value);
    this.$app.setStorageLanguageAndReload(value);
    // this.lang = value;
  }

  public render() {
    const {
      curLang,
      formInline,
      ruleInline,
      handleSubmit,
      isRememberPassword,
    } = this;
    return (
      <div class={styles["loginContainer"]}>
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
                  onon-change={(value) => {
                    this.changeLocale(value);
                  }}
                  class={styles["langSelect"]}
                  v-model={curLang}
                  style={{}}
                >
                  <i-option value={"zh-CN"}>
                    {this.$l(this.$l(this.$l(this.$l("简体中文"))))}
                  </i-option>
                  <i-option value={"en-US"}>ENGLISH</i-option>
                </Select>
              </div>
              <div class={styles["loginTitle"]}>
                {this.$l("login.loginTitle")}
              </div>
              <Form
                class={styles["form"]}
                ref="formInline"
                value={this.formInline}
                rules={this.ruleInline}
              >
                <FormItem prop="phone">
                  <Input
                    size="large"
                    type="text"
                    v-model={this.formInline.phone}
                    placeholder={this.$l("login.iphonePlaceholder")}
                  ></Input>
                </FormItem>
                <FormItem prop="password">
                  <Input
                    size="large"
                    type="password"
                    v-model={this.formInline.password}
                    placeholder={this.$l("login.passwordPlaceholder")}
                  ></Input>
                </FormItem>

                <FormItem>
                  <div class={styles["remember"]}>
                    <Checkbox v-model={this.isRememberPassword}>
                      {this.$l("login.nextAutoLogin")}
                    </Checkbox>
                    <a
                      onClick={() => {
                        this.$router.push({
                          name: "reset-password",
                        });
                      }}
                    >
                      {this.$l("login.forgotPassword")}
                    </a>
                  </div>
                </FormItem>
                <FormItem>
                  <Button
                    type="primary"
                    size="large"
                    long
                    onClick={() => {
                      handleSubmit("formInline");
                    }}
                    loading={this.loginLoading}
                  >
                    {this.$l("login.login")}
                  </Button>
                </FormItem>
              </Form>

              <div class={styles["register"]}>
                <span class={styles["desc"]}>
                  {" "}
                  {this.$l("login.noAccount")}
                </span>

                <a
                  onClick={() => {
                    // this.$router.push({ name: 'team-sign-in' });
                    window.open(
                      "https://jfengine.feishu.cn/share/base/form/shrcnlJLMKG5SFHPqggHpBY29qf"
                    );
                  }}
                >
                  {this.$l("login.join")}
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}
