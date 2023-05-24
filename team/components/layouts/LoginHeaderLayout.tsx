import { Component, Prop, Vue, Watch } from "vue-property-decorator";
// import User from '../../assets/imgs/user.csvg';
// import Role from '../../assets/imgs/role.csvg';
import styles from "./layout.module.less";
@Component({
  depends: [
    "api.sihpkp4z3rg7wvsozr5lkta9nxxiocqj.user.UserApi",
    "controller.TeamController",
    "component.AccountSetting",
  ],
})
export default class LoginHeaderLayout extends Vue {
  isShowAccountSetting: boolean = false;
  public async created() {
    // 判断是否登录
    if (await this.$app.auth.getToken()) {
      this.isShowAccountSetting = true;
    }
  }
  goOfficialWebsite() {
    if (this.isShowAccountSetting) {
      this.$router.push({
        name: "team-project-list",
      });
    } else {
      window.open("https://orang.cloud/#/nav/home");
    }
  }
  public render() {
    return (
      <header class={styles["header"]}>
        <div class={styles["header-wrapper"]}>
          <img
            class={styles["logo"]}
            onClick={() => {
              this.goOfficialWebsite();
            }}
            src={require("../../assets/imgs/orang_logo.svg")}
            alt=""
          />
          <h1 class={styles["mainTitle"]}>{this.$l("orang")}</h1>
          <span class={styles["title"]}>{this.$l("login.subTitle")}</span>
        </div>
        {this.isShowAccountSetting && (
          <account-setting isSimple={true}></account-setting>
        )}
      </header>
    );
  }
}
