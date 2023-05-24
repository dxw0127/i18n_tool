import { Role, RoleApi } from "@idg/acl/types";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Form,
  FormItem,
  Icon,
  Input,
  List,
  ListItem,
  ListItemMeta,
  Modal,
  Select,
  Step,
  Steps,
} from "@idg/iview";
import { Component, Model, Vue, Watch } from "vue-property-decorator";
import TeamMemberController, {
  TeamMember,
} from "../../controllers/TeamMemberController";
import TeamProjectController from "../../controllers/TeamProjectController";
import style from "./project.module.less";
interface AddTeamMember extends TeamMember {
  joinProject?: boolean;
  roleId?: string;
}
@Component({
  depends: [
    "api.dwvzflvcgqgkmtqumindtwrylbakozn3.acl-admin.RoleApi",
    "controller.TeamMemberController",
    "controller.TeamProjectController",
  ],
})
export default class CreateProject extends Vue {
  @Model("change")
  public visible: boolean;
  public roleApi: RoleApi;
  public teamMemberController: TeamMemberController;
  public teamProjectController: TeamProjectController;
  public roleList: Array<Role> = [];
  public teamMemberList: Array<AddTeamMember> = [];
  public loading = false;
  public currentStep = 0;
  public projectInf = {
    name: "",
    intro: "",
  };
  public addUserInf = {
    accountId: "",
    roleId: "",
  };
  public get projectMemberList() {
    return this.teamMemberList.filter((i) => i.joinProject);
  }
  @Watch("visible")
  public visibleChange(visible: boolean) {
    if (visible) {
      this.getRoleList();
      this.getTeamMembers();
      this.currentStep = 0;
      this.projectInf = {
        name: "",
        intro: "",
      };
    }
  }
  public async getTeamMembers() {
    this.teamMemberList = await this.teamMemberController.getAllMembers();
    const mine = this.teamMemberList.find(
      (i) => i.account_id === this.$app.auth.getAccountId()
    );
    if (!mine) {
      return;
    }
    this.$set(mine, "joinProject", true);
    this.$set(mine, "roleId", "12365c2c7648f9705010b4a7a6203dbb_admin_project");
  }
  public async getRoleList() {
    const res = await this.roleApi.allRoles({
      withChild: 0,
    });
    // const res = await this.roleApi.allRoles({});
    this.roleList = res.items;
    // this.roleList = res.items.filter(
    //   (i: Role & { status: string }) => i.id.startsWith('daee79c347fb8f69c2be46bf38f09f91') && i.status !== 'hide',
    // );
  }

  public async next() {
    if (!this.$refs.form) {
      return;
    }
    (this.$refs.form as Form).validate((result) => {
      if (result) {
        this.currentStep++;
      }
    });
  }
  public addUser() {
    const { addUserInf } = this;
    if (addUserInf.accountId && addUserInf.roleId) {
      const user = this.teamMemberList.find(
        (i) => i.account_id === addUserInf.accountId
      );
      if (!user) {
        return;
      }
      this.$set(user, "joinProject", true);
      this.$set(user, "roleId", addUserInf.roleId);
      this.addUserInf = {
        accountId: "",
        roleId: "",
      };
    }
  }
  public async handleMemberAction(action: string, member: AddTeamMember) {
    if (action === "remove") {
      member.joinProject = false;
      member.roleId = null;
    } else {
      member.roleId = action;
    }
  }
  public async onSubmit() {
    const { projectInf, teamMemberList } = this;
    this.loading = true;
    try {
      await this.teamProjectController.createProject({
        name: projectInf.name,
        desc: projectInf.intro,
        user_arr: teamMemberList
          .filter((i) => i.joinProject)
          .map((i) => ({
            account_id: i.account_id,
            role: i.roleId,
          })),
      });
      this.$Message.success(this.$l(this.$l(this.$l(this.$l("创建成功")))));
      this.$emit("change", false);
      this.$emit("update", true);
    } catch (error) {
      this.$Message.error(this.$l(this.$l(this.$l(this.$l("创建失败")))));
    }
    this.loading = false;
  }
  public renderRightForm() {
    const {
      projectInf,
      teamMemberList,
      roleList,
      addUserInf,
      projectMemberList,
    } = this;
    if (this.currentStep === 0) {
      return (
        <div class={style["right-form"]}>
          <div class={style["form-scroll-container"]}>
            <div class={style["form-header"]}>
              <h3>{this.$l(this.$l(this.$l(this.$l("新建项目"))))}</h3>
              <div>
                {this.$l(
                  this.$l(this.$l(this.$l("你可以在这里创建新的项目。")))
                )}
              </div>
            </div>
            <Form value={projectInf} label-position="top" ref="form">
              <FormItem
                label={this.$l(this.$l(this.$l(this.$l("项目名称"))))}
                prop="name"
                required
              >
                <Input
                  v-model={projectInf.name}
                  placeholder={this.$l(
                    this.$l(this.$l(this.$l("请输入项目名称")))
                  )}
                />
              </FormItem>
              <FormItem
                label={this.$l(this.$l(this.$l(this.$l("项目介绍"))))}
                prop="intro"
              >
                <Input
                  v-model={projectInf.intro}
                  type="textarea"
                  placeholder={this.$l(
                    this.$l(this.$l(this.$l("请输入项目介绍")))
                  )}
                  rows={6}
                />
              </FormItem>
            </Form>
          </div>
          <div class={style["footer-actions"]}>
            <div class={style["right-actions"]}>
              <Button onclick={() => this.$emit("change", false)}>
                {this.$l(this.$l(this.$l(this.$l("取消"))))}
              </Button>
              <Button type="primary" onclick={this.next}>
                {this.$l(this.$l(this.$l(this.$l("下一步"))))}
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div class={style["right-form"]}>
        <div class={style["form-scroll-container"]}>
          <div class={style["form-header"]}>
            <h3>{this.$l(this.$l(this.$l(this.$l("项目成员"))))}</h3>
            <div>
              {this.$l(
                this.$l(
                  this.$l(this.$l("邀请团队成员并管理与此项目协作的权限。"))
                )
              )}
            </div>
          </div>
          <div>
            <h4>{this.$l(this.$l(this.$l(this.$l("添加用户"))))}</h4>
            <div class={style["form-add-user"]}>
              <Select
                v-model={addUserInf.accountId}
                placeholder={this.$l(
                  this.$l(this.$l(this.$l("请从列表中选择用户")))
                )}
              >
                {teamMemberList
                  .filter((i) => !i.joinProject)
                  .map((i) => (
                    <i-option value={i.account_id} key={i.account_id}>
                      {i.name}
                    </i-option>
                  ))}
              </Select>
              <Select
                v-model={addUserInf.roleId}
                placeholder={this.$l(
                  this.$l(this.$l(this.$l("请选择项目权限")))
                )}
                style="width: 150px; margin: 0 8px;"
              >
                {roleList.map((i) => (
                  <i-option value={i.id} key={i.id}>
                    {i.name}
                  </i-option>
                ))}
              </Select>
              <Button type="primary" ghost onclick={this.addUser}>
                {this.$l(this.$l(this.$l(this.$l("确认添加"))))}
              </Button>
            </div>
          </div>
          <div>
            <h4>项目成员（{projectMemberList.length}）</h4>
            <List
              itemLayout="horizontal"
              dataSource={projectMemberList}
              class={style["form-user-list"]}
              scopedSlots={{
                renderItem: (item: AddTeamMember) => {
                  return (
                    <ListItem>
                      <Dropdown
                        slot="actions"
                        on-on-click={(name) =>
                          this.handleMemberAction(name, item)
                        }
                      >
                        <div>
                          {roleList.find((i) => i.id === item.roleId).name}
                          <Icon type="ios-arrow-down"></Icon>
                        </div>
                        <DropdownMenu slot="list">
                          {roleList.map((i) => (
                            <DropdownItem name={i.id} key={i.id}>
                              {i.name}
                            </DropdownItem>
                          ))}
                          <DropdownItem
                            name="remove"
                            divided
                            style="color: #F5222D;"
                          >
                            {this.$l(this.$l(this.$l(this.$l("移除"))))}
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                      <ListItemMeta title={item.name}>
                        <Avatar slot="avatar" src={item.avatar_url} />
                      </ListItemMeta>
                      <div></div>
                    </ListItem>
                  );
                },
              }}
            ></List>
          </div>
        </div>
        <div class={style["footer-actions"]}>
          <Button onclick={() => (this.currentStep = 0)}>
            {this.$l(this.$l(this.$l(this.$l("上一步"))))}
          </Button>
          <div class={style["right-actions"]}>
            <Button onclick={() => this.$emit("change", false)}>
              {this.$l(this.$l(this.$l(this.$l("取消"))))}
            </Button>
            <Button
              type="primary"
              loading={this.loading}
              onclick={this.onSubmit}
            >
              {this.$l(this.$l(this.$l(this.$l("确定"))))}
            </Button>
          </div>
        </div>
      </div>
    );
  }
  public render() {
    return (
      <Modal
        value={this.visible}
        title={this.$l(this.$l(this.$l(this.$l("创建新项目"))))}
        width={760}
        footer-hide={true}
        class-name={style["create-project-modal"]}
        on-on-visible-change={(v: boolean) => this.$emit("change", v)}
      >
        <div class={style["left-steps"]}>
          <Steps current={this.currentStep} direction="vertical" size="small">
            <Step title={this.$l(this.$l(this.$l(this.$l("新建项目"))))}></Step>
            <Step title={this.$l(this.$l(this.$l(this.$l("项目成员"))))}></Step>
          </Steps>
        </div>
        {this.renderRightForm()}
      </Modal>
    );
  }
}
