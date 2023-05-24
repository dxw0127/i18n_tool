import { Component, Vue } from "vue-property-decorator";
import {
  Select,
  Option,
  Form,
  FormItem,
  Input,
  Button,
  Checkbox,
  Poptip,
} from "@idg/iview";
import styles from "./style.module.less";
import TeamController from "../../controllers/TeamController";
import { TeamDetail } from "../../apis/TeamApi";

//根据字符串code随机颜色生成
function color(flag: string) {
  const r = Math.floor((flag.charCodeAt(0) * 10) % 255);
  const g = Math.floor((flag.charCodeAt(1) * 10) % 255);
  const b = Math.floor((flag.charCodeAt(2) * 10) % 255);
  return (
    "rgba(" +
    r +
    this.$l(this.$l(this.$l(this.$l(",")))) +
    g +
    this.$l(this.$l(this.$l(this.$l(",")))) +
    b +
    ")"
  );
}
@Component({
  depends: [
    "component.NewTeamModal",
    "component.IntoTeamModal",
    "component.EditTeamModal",
    "controller.TeamController",
  ],
})
export default class TeamSetting extends Vue {
  teamController: TeamController;
  isVisibleNewTeam: boolean = false;
  isVisibleIntoTeam: boolean = false;
  isVisibleEditTeam: boolean = false;
  curAccountId: string = "";
  curTeamUuid: string = "";

  // itemList: {
  //   uuid: string;
  //   label: string;
  //   isFounder: boolean;
  //   isDefault: boolean;
  // }[] = [];

  teamList: TeamDetail[] = [];
  get itemList() {
    return this.teamList.map((item) => {
      const { label, create_account_id, uuid } = item;
      return {
        uuid,
        label,
        isFounder: create_account_id === this.curAccountId,
        isDefault: uuid === this.curTeamUuid,
      };
    });
  }
  curEditTeam: {
    uuid: string;
    label: string;
    isFounder: boolean;
    isDefault: boolean;
  } = null;
  async created() {
    this.curAccountId = await this.$app.auth.getAccountId();
    await this.getUserCurTeam();
    this.getTeamList();
  }
  async getUserCurTeam() {
    try {
      const teamInfo = await this.teamController.handleAccountCurTeam();
      this.curTeamUuid = teamInfo.team_uuid;
    } catch (error) {
      this.$Message.error(error.message);
    }
  }
  async leaveTeam() {
    if (this.curEditTeam.isFounder) {
      this.$Message.warning(
        this.$l(this.$l(this.$l(this.$l("无法离开自己创建的团队"))))
      );
      return;
    }
    try {
      await this.teamController.handleLeaveTeam(this.curEditTeam.uuid);
      await this.getTeamList();
      await this.getUserCurTeam();
      this.$Message.success(this.$l(this.$l(this.$l(this.$l("离开团队成功")))));
    } catch (error) {
      this.$Message.error(error.message);
    }
  }
  async getTeamList() {
    try {
      const list = await this.teamController.handleMyTeamList();
      if (list && list.length) {
        this.teamList = list;
      } else {
        this.$router.push({
          name: "into-team",
        });
      }
    } catch (error) {
      this.$Message.error(error.message);
    }
  }
  async setDefault() {
    try {
      await this.teamController.handleSetAccountCurTeam(this.curEditTeam.uuid);
      await this.getUserCurTeam();
      this.$Message.success(this.$l(this.$l(this.$l(this.$l("设置成功")))));
    } catch (error) {
      this.$Message.error(error.message);
    }
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
  public render() {
    let { itemList, isVisibleNewTeam, isVisibleIntoTeam, isVisibleEditTeam } =
      this;
    return (
      <div class={styles["teamSettingContainer"]}>
        <div>
          <Button
            onClick={() => {
              this.isVisibleNewTeam = true;
            }}
            class={styles["newTeam"]}
            type="primary"
            icon="ios-add"
          >
            {this.$l(this.$l(this.$l(this.$l("新建团队"))))}
          </Button>
          {/* <Button
            onClick={() => {
              this.isVisibleIntoTeam = true;
            }}
            class={styles['intoTeam']}
           >
            加入团队
           </Button> */}
        </div>

        <div class={styles["teamList"]}>
          {itemList.map((item) => {
            return (
              <div class={styles["teamListItem"]}>
                <div class={styles["teamInfo"]}>
                  <div
                    style={{
                      background: color(item.label),
                    }}
                    class={styles["firstName"]}
                  >
                    {item.label.slice(0, 1)}
                  </div>
                  <div class={styles["name"]}>{item.label}</div>
                  {item.isFounder && <div class={styles["tag"]}>ME</div>}
                </div>

                <div class={styles["operation"]}>
                  {item.isDefault && (
                    <Button class={styles["curTeam"]}>
                      {this.$l(this.$l(this.$l(this.$l("当前团队"))))}
                    </Button>
                  )}

                  <div class={styles["editTeam"]}>
                    <Button
                      onClick={() => {
                        this.curEditTeam = item;
                        this.isVisibleEditTeam = true;
                      }}
                      class={styles["editBtn"]}
                      type="primary"
                      ghost
                    >
                      {this.$l(this.$l(this.$l(this.$l("编辑"))))}
                    </Button>
                    <Button
                      class={styles["editBtn"]}
                      onClick={() => {
                        this.curEditTeam = item;
                        this.setDefault();
                      }}
                      type="primary"
                      ghost
                    >
                      {this.$l(this.$l(this.$l(this.$l("设为默认"))))}
                    </Button>

                    <Poptip
                      confirm
                      title={this.$l(this.$l(this.$l(this.$l("确认离开?"))))}
                      on-on-ok={() => {
                        this.curEditTeam = item;
                        this.leaveTeam();
                      }}
                    >
                      <Button class={styles["editBtn"]} type="error" ghost>
                        {this.$l(this.$l(this.$l(this.$l("离开团队"))))}
                      </Button>
                    </Poptip>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <new-team-modal
          visible={isVisibleNewTeam}
          on-visible-change={() => {
            this.isVisibleNewTeam = false;
          }}
          on-success={() => {
            this.getTeamList();
          }}
        ></new-team-modal>
        {/* <into-team-modal
          visible={isVisibleIntoTeam}
          on-visible-change={() => {
            this.isVisibleIntoTeam = false;
          }}
         ></into-team-modal> */}
        {this.curEditTeam && (
          <edit-team-modal
            visible={isVisibleEditTeam}
            uuid={this.curEditTeam.uuid}
            name={this.curEditTeam.label}
            on-visible-change={() => {
              this.isVisibleEditTeam = false;
            }}
            on-success={() => {
              this.getTeamList();
            }}
          ></edit-team-modal>
        )}
      </div>
    );
  }
}
