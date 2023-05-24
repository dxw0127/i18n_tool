import { Vue, Component } from "vue-property-decorator";
// import { clearCachedPermissions } from '@idg/acl';
import _ from "lodash";
import { Button } from "@idg/iview";
import styles from "./style.module.less";
import { UserApi } from "@idg/ucenter";
import TeamController from "../../controllers/TeamController";
@Component({
  depends: [
    "api.sihpkp4z3rg7wvsozr5lkta9nxxiocqj.user.UserApi",
    "controller.TeamController",
    "component.LoginHeaderLayout",
  ],
})
export default class TeamInvitePage extends Vue {
  private userApi: UserApi;
  teamController: TeamController;
  curLang: "zh" | "en" = "zh";
  avatar: string = "";
  inviterName: string = "";
  teamUuid: string = "";
  teamName: string = "";
  loading: boolean = false;
  isInviteStatus: boolean = true;
  public async created() {
    // 判断是否登录
    if (!(await this.$app.auth.getToken())) {
      this.$Message.error(
        this.$l(this.$l(this.$l(this.$l("用户暂未登录，请登录后重试"))))
      );
      this.$router.push({
        name: "team-login",
        query: {
          redirectInvite: "1",
        },
      });
      return;
    }
    this.getTeamList();
    this.getInviterInfo();
    this.getTeamInfo();
  }
  async getTeamList() {
    try {
      const id = this.$route.query.team_uuid as string;
      const list = await this.teamController.handleMyTeamList();
      if (list && list.find((item) => item.uuid === id)) {
        this.$Message.info(
          this.$l(this.$l(this.$l(this.$l("您已经是该团队成员"))))
        );
        this.$router.push({
          name: "team-project-list",
        });
      }
    } catch (error) {
      this.$Message.error(error.message);
    }
  }
  async getInviterInfo() {
    const id = this.$route.query.invite_user_account_id as string;
    if (id) {
      try {
        const inviter = await this.userApi.getUser({
          account_id: id,
        });
        this.avatar = inviter.avatar_url;
        this.inviterName = inviter.name;
      } catch (error) {
        this.$Message.error(error.message);
      }
    } else {
      this.$Message.error(
        this.$l(this.$l(this.$l(this.$l("邀请链接格式错误！"))))
      );
      this.isInviteStatus = false;
    }
  }
  async getTeamInfo() {
    const id = this.$route.query.team_uuid as string;
    this.teamUuid = id;
    if (id) {
      try {
        const detail = await this.teamController.handleGetTeamDetail({
          uuid: id,
        });
        this.teamName = detail.label;
        if (detail.invite_url_status !== "1") {
          this.isInviteStatus = false;
        }
      } catch (error) {
        this.$Message.error(error.message);
      }
    } else {
      this.$Message.error(
        this.$l(this.$l(this.$l(this.$l("邀请链接格式错误"))))
      );
      this.isInviteStatus = false;
    }
  }
  async handleSubmit() {
    this.loading = true;
    try {
      await this.teamController.handleJoinTeamByUuid(this.teamUuid);
      this.$Message.success(this.$l(this.$l(this.$l(this.$l("加入团队成功")))));
      this.$router.push({
        name: "team-project-list",
        query: {
          isShowChangeTeam: "1",
        },
      });
    } catch (error) {
      this.$Message.success(error.message);
    } finally {
      this.loading = false;
    }
  }
  renderInviteCard() {
    const { handleSubmit } = this;
    return (
      <div class={styles["inviteWrapper"]}>
        <img
          class={styles["inviteTitle"]}
          src={require("../../assets/imgs/零壤-横向-白底.svg")}
          alt=""
        />
        <img
          class={styles["avatar"]}
          src={
            this.avatar
              ? this.avatar
              : require("../../assets/imgs/default-avatar.png")
          }
          alt={this.$l(this.$l(this.$l(this.$l("头像"))))}
        />

        <div class={styles["inviterRow"]}>
          <span class={styles["inviter"]}>{this.inviterName}</span>
          <span class={styles["inviterContent"]}>
            {this.$l(this.$l(this.$l(this.$l("邀请你加入团队"))))}
          </span>
        </div>
        <div class={styles["inviteTame"]}>{this.teamName}</div>
        <Button
          class={styles["inviteBtn"]}
          type="primary"
          size="large"
          loading={this.loading}
          onClick={() => {
            handleSubmit();
          }}
        >
          {this.$l(this.$l(this.$l(this.$l("立刻加入"))))}
        </Button>
      </div>
    );
  }
  renderNoInviteCard() {
    return (
      <div class={styles["noInviteWrapper"]}>
        <div class={styles["invalidTitle"]}>
          {this.$l(this.$l(this.$l(this.$l("团队邀请链接已失效"))))}
        </div>
        <div class={styles["invalidDesc"]}>
          {this.$l(
            this.$l(this.$l(this.$l("该团队邀请链接已失效，请联系团队管理员")))
          )}
        </div>
        <img
          class={styles["invalidImg"]}
          src={require("../../assets/imgs/invalid.png")}
          alt=""
        />
      </div>
    );
  }
  public render() {
    return (
      <div class={[styles["loginContainer"], styles["inviteContainer"]]}>
        <login-header-layout></login-header-layout>
        <main>
          {this.isInviteStatus
            ? this.renderInviteCard()
            : this.renderNoInviteCard()}
        </main>
      </div>
    );
  }
}
