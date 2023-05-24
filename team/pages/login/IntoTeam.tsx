import { Vue, Component } from "vue-property-decorator";
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
import TeamController from "../../controllers/TeamController";
@Component({
  depends: [
    "component.NewTeamModal",
    "component.IntoTeamModal",
    "controller.TeamController",
    "component.LoginHeaderLayout",
  ],
})
export default class IntoTeamPage extends Vue {
  curLang: "zh" | "en" = "zh";
  teamController: TeamController;
  isVisibleNewTeam: boolean = false;
  isVisibleIntoTeam: boolean = false;
  isRememberPassword: boolean = false;
  public async created() {
    // 判断是否登录
    if (!(await this.$app.auth.getToken())) {
      this.$Message.error(
        this.$l(this.$l(this.$l(this.$l("用户暂未登录，请登录后重试"))))
      );
      this.$router.push({
        name: "team-login",
      });
      return;
    }
    this.handleUserTeamInfo();
  }

  // 处理团队信息
  async handleUserTeamInfo() {
    try {
      const teamInfo = await this.teamController.handleAccountCurTeam();
      // 设置当前用户TeamUuid
      if (teamInfo && teamInfo.team_uuid) {
        this.$router.push({
          name: "team-project-list",
        });
      }
    } catch (error) {
      this.$Message.error(error.message);
    }
  }
  public render() {
    // const { curLang, formInline, ruleInline, handleSubmit, isRememberPassword } = this;
    return (
      <div class={[styles["loginContainer"], styles["intoTeamContainer"]]}>
        <login-header-layout></login-header-layout>
        <main>
          <div class={styles["intoTeamWrapper"]}>
            <div class={styles["intoTeamTitle"]}>
              {this.$l(this.$l(this.$l(this.$l("您还未加入任何团队"))))}
            </div>
            <div class={styles["intoTeamDesc"]}>
              {this.$l(
                this.$l(
                  this.$l(
                    this.$l(
                      "您可以选择通过邀请链接加入某个团队或自己创建一个团队"
                    )
                  )
                )
              )}
            </div>

            <img
              class={styles["intoTeamImg"]}
              src={require("../../assets/imgs/into-team.png")}
              alt=""
            />

            <Button
              class={styles["intoTeamBtn"]}
              type="primary"
              size="large"
              long
              onClick={() => {
                this.isVisibleIntoTeam = true;
              }}
            >
              {this.$l(this.$l(this.$l(this.$l("立刻加入"))))}
            </Button>

            {/* <Button
              class={styles['intoTeamBtn']}
              type='primary'
              size='large'
              long
              onClick={() => {
                this.isVisibleNewTeam = true;
              }}
             >
              创建团队
             </Button> */}

            <a
              onClick={() => {
                this.isVisibleNewTeam = true;
              }}
              class={styles["newTeam"]}
            >
              {this.$l(this.$l(this.$l(this.$l("创建团队"))))}
            </a>
          </div>
        </main>

        <new-team-modal
          visible={this.isVisibleNewTeam}
          on-visible-change={() => {
            this.isVisibleNewTeam = false;
          }}
          on-success={() => {
            this.$router.push({
              name: "team-project-list",
            });
          }}
        ></new-team-modal>

        <into-team-modal
          visible={this.isVisibleIntoTeam}
          on-visible-change={() => {
            this.isVisibleIntoTeam = false;
          }}
        ></into-team-modal>
      </div>
    );
  }
  handleSubmit(name) {
    (this.$refs[name] as Form).validate((valid) => {
      if (valid) {
        this.$Message.success("Success!");
      } else {
        this.$Message.error("Fail!");
      }
    });
  }
}
