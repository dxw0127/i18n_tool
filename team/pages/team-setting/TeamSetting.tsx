import {
  Avatar,
  Button,
  Input,
  List,
  ListItem,
  ListItemMeta,
  Spin,
  Switch,
} from "@idg/iview";
import { Component, Vue } from "vue-property-decorator";
import TeamMemberController, {
  TeamMember,
} from "../../controllers/TeamMemberController";
import { store } from "../../store";
import Clipboard from "clipboard";
import style from "./team-setting.module.less";
import TeamController from "../../controllers/TeamController";
let clipboard: Clipboard | null = null;
@Component({
  depends: [
    "component.TeamLayout",
    "component.TeamPageHeader",
    "controller.TeamMemberController",
    "controller.TeamController",
  ],
})
export default class TeamSetting extends Vue {
  public teamMemberController: TeamMemberController;
  public teamController: TeamController;
  public list: Array<TeamMember> = [];
  public loading = false;
  public phone = "";
  public sendLoading = false;
  public statusLoading = false;
  public get accountId() {
    return this.$app.auth.getAccountId();
  }
  public get inviteUrl() {
    return (
      location.protocol +
      "//" +
      location.host +
      location.pathname +
      "#/team/invite?team_uuid=" +
      store.currentTeamUuid +
      "&invite_user_account_id=" +
      this.accountId
    );
  }
  public get isCreator() {
    const team = store.currentTeamInf && store.currentTeamInf.team;
    return team && team.create_account_id === this.accountId;
  }
  public created() {
    this.getList();
  }
  public mounted() {
    clipboard = new Clipboard(".copy-invite-url");
    clipboard.on("success", (e) => {
      e.clearSelection();
      this.$Message.success(this.$l(this.$l(this.$l(this.$l("复制成功")))));
    });
    clipboard.on("error", () => {
      this.$Message.error(this.$l(this.$l(this.$l(this.$l("复制失败")))));
    });
  }
  public destroyed() {
    clipboard.destroy();
  }
  public async getList() {
    this.loading = true;
    try {
      this.list = await this.teamMemberController.getAllMembers();
    } catch (e) {
      this.$Message.error(this.$l(this.$l(this.$l(this.$l("获取失败")))));
    }
    this.loading = false;
  }
  public async handleStatusChange(status: string) {
    const team = store.currentTeamInf && store.currentTeamInf.team;
    this.statusLoading = true;
    try {
      await this.teamController.updateTeamInfo({
        ...team,
        invite_url_status: status,
      });
      this.$Message.success(this.$l(this.$l(this.$l(this.$l("修改成功")))));
      await this.teamController.handleAccountCurTeam();
    } catch (e) {
      this.$Message.error(this.$l(this.$l(this.$l(this.$l("修改失败")))));
    }
    this.statusLoading = false;
  }
  public async sendCode() {
    this.sendLoading = true;
    try {
      await this.teamMemberController.addMemberByPhone(
        this.phone,
        this.inviteUrl
      );
      this.$Message.success(this.$l(this.$l(this.$l(this.$l("发送成功")))));
      this.phone = "";
    } catch (e) {
      this.$Message.error(this.$l(this.$l(this.$l(this.$l("发送失败")))));
    }
    this.sendLoading = false;
  }
  public async handleActions(id: string, name: string) {
    if (name === "remove") {
      this.$Modal.confirm({
        title: this.$l(this.$l(this.$l(this.$l("确认移除吗？")))),
        onOk: async () => {
          await this.teamMemberController.removeMember(id);
          this.$Message.success(this.$l(this.$l(this.$l(this.$l("移除成功")))));
          this.getList();
        },
      });
    } else {
    }
  }
  public removeMember(member: TeamMember) {
    this.$Modal.confirm({
      title: this.$l(this.$l(this.$l(this.$l("确认移除吗？")))),
      onOk: async () => {
        await this.teamMemberController.removeMember(member.account_id);
        this.$Message.success(this.$l(this.$l(this.$l(this.$l("移除成功")))));
        this.getList();
      },
    });
  }
  public render() {
    const {
      list,
      sendLoading,
      loading,
      inviteUrl,
      accountId,
      isCreator,
      statusLoading,
    } = this;
    const team = store.currentTeamInf && store.currentTeamInf.team;
    return (
      <div>
        <team-page-header
          title={this.$l(this.$l(this.$l(this.$l("团队管理"))))}
          backIcon={false}
        >
          <div>
            {this.$l(this.$l(this.$l(this.$l("邀请用户加入团队并管理权限"))))}
          </div>
        </team-page-header>
        {isCreator && (
          <div class={style["user-add"]}>
            {statusLoading && <Spin fix></Spin>}
            <h3>邀请用户进入“飓风力量”团队</h3>
            <div>
              零壤ORang低代码，友好的交互、更强大的功能。添加团队成员立刻开始协作。
            </div>
            <div style="margin-top: 24px;">
              <Switch
                true-value="1"
                false-value="0"
                value={team && team.invite_url_status}
                on-on-change={this.handleStatusChange}
              />
              <div style="display: inline-block; margin-left: 8px; vertical-align: middle">
                {team.invite_url_status === "1"
                  ? this.$l(this.$l(this.$l(this.$l("链接邀请已开启"))))
                  : this.$l(this.$l(this.$l(this.$l("链接邀请未开启"))))}
              </div>
            </div>
            {team && team.invite_url_status === "1" && (
              <div>
                <h4 style="margin-top: 16px;">
                  {this.$l(this.$l(this.$l(this.$l("公开链接"))))}
                </h4>
                <div class={style["user-add-action"]}>
                  <Input value={inviteUrl} disabled id="invite-url-input" />
                  <Button
                    class="copy-invite-url"
                    data-clipboard-target="#invite-url-input"
                  >
                    {this.$l(this.$l(this.$l(this.$l("复制链接"))))}
                  </Button>
                </div>
                <h4 style="margin-top: 24px;">
                  {this.$l(this.$l(this.$l(this.$l("发送邀请信息"))))}
                </h4>
                <div class={style["user-add-action"]}>
                  <Input
                    v-model={this.phone}
                    placeholder="请输入用户电子邮件、手机号"
                  />
                  <Button
                    type="primary"
                    loading={sendLoading}
                    onclick={this.sendCode}
                  >
                    {this.$l(this.$l(this.$l(this.$l("发送邀请"))))}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        <div class={style["user-list"]}>
          <h3>团队成员（{list.length}）</h3>
          <List
            itemLayout="horizontal"
            dataSource={list}
            loading={loading}
            scopedSlots={{
              renderItem: (item: TeamMember) => (
                <ListItem>
                  <ListItemMeta title={item.name}>
                    <Avatar slot="avatar" src={item.avatar_url} />
                  </ListItemMeta>
                  <div class={style["list-content"]}>
                    <div style="color: rgba(0, 0, 0, 0.45);">
                      {item.created_at}
                      {this.$l(this.$l(this.$l(this.$l("加入团队"))))}
                    </div>
                    <div style="width: 100px;">
                      {team.create_account_id === item.account_id
                        ? this.$l(this.$l(this.$l(this.$l("团队所有者"))))
                        : this.$l(this.$l(this.$l(this.$l("团队成员"))))}
                    </div>
                    {isCreator && (
                      <div style="width: 50px;">
                        {accountId === item.account_id ? (
                          <span>-</span>
                        ) : (
                          <a onclick={() => this.removeMember(item)}>
                            {this.$l(this.$l(this.$l(this.$l("移除"))))}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </ListItem>
              ),
            }}
          ></List>
        </div>
      </div>
    );
  }
}
