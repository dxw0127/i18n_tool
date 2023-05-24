import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import {
  Layout,
  Header,
  Poptip,
  Divider,
  Modal,
  RadioGroup,
  Radio,
} from "@idg/iview";
// import User from '../../assets/imgs/user.csvg';
// import Role from '../../assets/imgs/role.csvg';
import style from "./layout.module.less";
import TeamController from "../../controllers/TeamController";
import { UserApi } from "@idg/ucenter";
import { store } from "../../store/index";
import { TeamDetail } from "../../apis/TeamApi";
import { LoginApi } from "@idg/account";
import { clearCachedPermissions } from "@idg/acl";
@Component({
  depends: [
    "api.sihpkp4z3rg7wvsozr5lkta9nxxiocqj.user.UserApi",
    "api.doatnnuotjlwbh6r83jed1m7yvwrps5q.login.LoginApi",
    "controller.TeamController",
  ],
})
export default class AccountSetting extends Vue {
  private loginApi: any;
  private userApi: UserApi;
  @Prop({
    default: false,
  })
  isSimple: boolean;
  teamController: TeamController;
  avatar: string = "";
  userName: string = "";
  userType: string = "";
  teamName: string = "";
  public loading: boolean = true;
  public isShowModal: boolean = false;
  curDefaultTeam: string = "";
  curUserId: string = "";
  teamList: TeamDetail[] = [];
  get userInfo() {
    return (
      store.currentUserInf || {
        name: "",
        avatar_url: "",
      }
    );
  }
  get itemList() {
    if (!store.currentTeamInf || !this.curUserId) return [];
    return this.teamList.map((item) => {
      const { label, create_account_id, uuid } = item;
      return {
        uuid,
        label,
        isFounder: create_account_id === this.curUserId,
        isDefault: uuid === store.currentTeamInf.team_uuid,
      };
    });
  }
  get isFounder() {
    if (store.currentTeamInf) {
      return store.currentTeamInf.account_id === this.curUserId;
    } else {
      return false;
    }
  }
  public async created() {
    // 判断是否登录
    this.getUserInfo();
    this.getUserCurTeam();
    if (this.$route.query.isShowChangeTeam) {
      this.changeTeam();
    }
  }
  async getTeamList() {
    try {
      const list = await this.teamController.handleMyTeamList();
      if (list) {
        this.teamList = list;
      }
    } catch (error) {
      this.$Message.error(error.message);
    }
  }
  async getUserCurTeam(force: boolean = false) {
    // if (store.currentTeamInf && !force) {
    //   this.curDefaultTeam = store.currentTeamInf.team_uuid;
    //   return;
    // }
    try {
      const teamInfo = await this.teamController.handleAccountCurTeam();
      if (!teamInfo.team_uuid) {
        this.$router.push({
          name: "into-team",
        });
      }
      this.curDefaultTeam = teamInfo.team_uuid;
    } catch (error) {
      this.$Message.error(error.message);
    }
  }
  async getUserInfo() {
    try {
      const user = await this.userApi.getCurrentUser();
      this.curUserId = user.account_id;
      this.avatar = user.avatar_url;
      this.userName = user.name;
      store.setUserInf(user);
    } catch (error) {
      this.$Message.error(error.message);
    }
  }
  async setDefault() {
    try {
      this.loading = true;
      await this.teamController.handleSetAccountCurTeam(this.curDefaultTeam);
      await this.getUserCurTeam(true);
      this.$Message.success(this.$l(this.$l(this.$l(this.$l("设置成功")))));
      this.isShowModal = false;
    } catch (error) {
      this.$Message.error(error.message);
    } finally {
      this.loading = false;
      this.$nextTick(() => {
        this.loading = true;
      });
    }
  }
  async changeTeam() {
    this.isShowModal = true;
    this.getTeamList();
  }
  private async logout() {
    const token = this.$app.auth.getToken() || "";
    clearCachedPermissions();
    try {
      await this.loginApi.logOut(token);
    } catch (error) {
      this.$Message.error(error.message);
    }
    try {
      await this.$app.auth.clear();
    } catch (error) {
      this.$Message.error(error.message);
    }
    this.$router.push({
      name: "team-login",
    });
  }
  renderChangeTeam() {
    return (
      <Modal
        v-model={this.isShowModal}
        title={this.$l(this.$l(this.$l(this.$l("切换团队"))))}
        // footer-hide={true}
        width={480}
        class={style["changeTeamContainer"]}
        on-on-cancel={() => {
          this.isShowModal = false;
          this.$emit("visible-change", false);
        }}
        on-on-ok={() => {
          this.setDefault();
        }}
        loading={this.loading}
      >
        <div class={style["changeTeamContent"]}>
          <div class={style["desc"]}>
            {this.$l(
              this.$l(
                this.$l(
                  this.$l("您可以选择并切换团队，刷新页面后默认打开该团队。")
                )
              )
            )}
          </div>

          <RadioGroup
            class={style["radioGroup"]}
            v-model={this.curDefaultTeam}
            vertical
          >
            {this.itemList.map((item) => {
              return (
                <Radio label={item.uuid}>
                  <span class={style["label"]}>{item.label}</span>
                  {item.isDefault && (
                    <span class={style["curTeam"]}>
                      {this.$l(this.$l(this.$l(this.$l("当前所在"))))}
                    </span>
                  )}

                  {item.isFounder && (
                    <span class={style["createTeam"]}>
                      {this.$l(this.$l(this.$l(this.$l("我创建的"))))}
                    </span>
                  )}
                </Radio>
              );
            })}
          </RadioGroup>
        </div>
      </Modal>
    );
  }
  public render() {
    return (
      <div class={style["team-account-setting"]}>
        <Poptip
          content="content"
          on-on-popper-show={() => {
            this.getUserCurTeam();
          }}
        >
          <img
            class={style["avatar"]}
            src={
              this.userInfo.avatar_url
                ? this.userInfo.avatar_url
                : require("../../assets/imgs/default-avatar.png")
            }
            alt={this.$l(this.$l(this.$l(this.$l("头像"))))}
          />

          <div class={style["content"]} slot="content">
            <div class={style["row"]}>
              <span class={style["userName"]}>{this.userInfo.name}</span>
              {!this.isSimple && (
                <span class={style["userType"]}>
                  {" "}
                  {this.isFounder
                    ? this.$l(this.$l(this.$l(this.$l("创建者"))))
                    : this.$l(this.$l(this.$l(this.$l("开发者"))))}
                </span>
              )}
            </div>
            {/* {!this.isSimple && (
              <div class={style['row']}>
                <span class={style['teamName']}>{store.currentTeamInf ? store.currentTeamInf.team.label : ''}</span>
                  <img
                  class={style['changeTeam']}
                  onClick={() => {
                    this.changeTeam();
                  }}
                  src={require('../../assets/imgs/Vector.svg')}
                />
              </div>
             )} */}

            <Divider />
            <div
              class={style["userSetting"]}
              onClick={() => {
                this.$router.push({
                  name: "team-user-setting",
                });
              }}
            >
              {this.$l(this.$l(this.$l(this.$l("个人设置"))))}
            </div>
            <div
              class={style["logout"]}
              onClick={async () => {
                this.logout();
              }}
            >
              {this.$l(this.$l(this.$l(this.$l("退出登录"))))}
            </div>
          </div>
        </Poptip>
        {this.renderChangeTeam()}
      </div>
    );
  }
}
