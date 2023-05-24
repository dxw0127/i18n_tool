import { Component, Vue } from "vue-property-decorator";
import { Layout, Header } from "@idg/iview";
// import User from '../../assets/imgs/user.csvg';
import Bell from "../../assets/imgs/bell.csvg";
// import Role from '../../assets/imgs/role.csvg';
import style from "./layout.module.less";
import TeamController from "../../controllers/TeamController";
@Component({
  depends: [
    "api.sihpkp4z3rg7wvsozr5lkta9nxxiocqj.user.UserApi",
    "controller.TeamController",
    "component.AccountSetting",
  ],
})
export class ORHeader extends Vue {
  teamController: TeamController;
  public orTitle: string = "";
  public async created() {
    const temp = (await this.$idg.storage.getItem("or-config")) as {
      title?: string;
    };
    if (temp && typeof temp == "object") {
      if (temp.hasOwnProperty("title")) {
        this.orTitle = temp.title;
      }
    }
  }
  public render() {
    return (
      <Header class={style["team-header"]}>
        <div
          onClick={() => {
            this.$router.push({
              name: "team-project-list",
            });
          }}
          class={style["logo"]}
        >
          {this.orTitle === "" ? (
            <img src={require("../../assets/imgs/logo.svg")} />
          ) : (
            <div class={style["or-title"]}>{this.orTitle}</div>
          )}
        </div>
        <div class={style["team-head-actions"]}>
          {/* <User /> */}
          <Bell />
          {/* <Role /> */}
          {/* <Locale /> */}
          <account-setting></account-setting>
        </div>
      </Header>
    );
  }
}
@Component({
  depends: ["component.ORHeader"],
})
export default class HeaderLayout extends Vue {
  teamController: TeamController;
  public async created() {}
  public render() {
    return (
      <Layout class={style["team-layout"]}>
        <OR-Header />
        {this.$slots.default}
      </Layout>
    );
  }
}
