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
  Menu,
  MenuItem,
  Modal,
  Select,
} from "@idg/iview";
import { Component, Model, Vue, Prop, Watch } from "vue-property-decorator";
import ProjectList from "../../assets/imgs/project-list.csvg";
import Member from "../../assets/imgs/member.csvg";
import style from "./project.module.less";
import TeamProjectController, {
  ProjectMember,
  TeamProject,
} from "../../controllers/TeamProjectController";
import TeamMemberController, {
  TeamMember,
} from "../../controllers/TeamMemberController";
import RoleApi from "@idg/acl/types/acl-admin/apis/RoleApi";
import { Role } from "@idg/acl/types";
@Component({
  depends: [
    "api.dwvzflvcgqgkmtqumindtwrylbakozn3.acl-admin.RoleApi",
    "controller.TeamMemberController",
    "controller.TeamProjectController",
  ],
})
export default class EditProject extends Vue {
  @Model("change")
  public visible: boolean;
  @Prop()
  public project!: TeamProject;
  public roleApi: RoleApi;
  public teamMemberController: TeamMemberController;
  public teamProjectController: TeamProjectController;
  public currentMenuKey = "project";
  public projectInf = {
    name: "",
    intro: "",
  };
  public addLoading = false;
  public addUserInf = {
    accountId: "",
    roleId: "",
  };
  public projectMemberList: Array<ProjectMember> = [];
  public teamMemberList: Array<TeamMember> = [];
  public roleList: Array<Role> = [];
  public submitLoading = false;
  public loading = false;
  public get factTeamMemberList() {
    const usedIds = this.projectMemberList.map((i) => i.account_id);
    return this.teamMemberList.filter((i) => !usedIds.includes(i.account_id));
  }
  @Watch("visible")
  public visibleChange(visible: boolean) {
    if (visible) {
      this.getRoleList();
      this.getTeamMembers();
      this.getProjectMembers();
      this.currentMenuKey = "project";
      this.projectInf = {
        name: this.project.name,
        intro: this.project.desc,
      };
      this.addUserInf = {
        accountId: "",
        roleId: "",
      };
    }
  }
  public async getTeamMembers() {
    this.teamMemberList = await this.teamMemberController.getAllMembers();
  }
  public async getProjectMembers() {
    this.loading = true;
    this.projectMemberList = await this.teamProjectController.getProjectMembers(
      this.project
    );
    this.loading = false;
  }
  public async getRoleList() {
    const res = await this.roleApi.allRoles({
      withChild: 0,
    });
    this.roleList = res.items;
    // this.roleList = res.items.filter(
    //   (i: Role & { status: string }) => i.id.startsWith('daee79c347fb8f69c2be46bf38f09f91') && i.status !== 'hide',
    // );
  }

  public async onSubmit() {
    const { project, projectInf } = this;
    this.submitLoading = true;
    try {
      await this.teamProjectController.updateProjectInf({
        appid: project.appid,
        name: projectInf.name,
        desc: projectInf.intro,
      });
      this.$Message.success(this.$l(this.$l(this.$l(this.$l("保存成功")))));
      this.$emit("change", false);
      this.$emit("update", true);
    } catch (error) {
      this.$Message.error(this.$l(this.$l(this.$l(this.$l("保存失败")))));
    }
    this.submitLoading = false;
  }
  public async onAddMember() {
    const { addUserInf } = this;
    this.addLoading = true;
    try {
      await this.teamProjectController.setProjectMemberRole(
        this.project,
        addUserInf.accountId,
        addUserInf.roleId
      );
      this.$Message.success(this.$l(this.$l(this.$l(this.$l("添加成功")))));
      this.addUserInf = {
        accountId: "",
        roleId: "",
      };
      this.getProjectMembers();
    } catch (error) {
      this.$Message.error(this.$l(this.$l(this.$l(this.$l("添加失败")))));
    }
    this.addLoading = false;
  }
  public async handleMemberAction(action: string, member: ProjectMember) {
    if (action === "remove") {
      this.$Modal.confirm({
        title: this.$l(this.$l(this.$l(this.$l("确认移除吗？")))),
        onOk: async () => {
          await this.teamProjectController.removeProjectMember(
            this.project,
            member.account_id,
            member.roleId
          );
          this.$Message.success(this.$l(this.$l(this.$l(this.$l("移除成功")))));
          await this.getProjectMembers();
        },
      });
    } else {
      await this.teamProjectController.setProjectMemberRole(
        this.project,
        member.account_id,
        action
      );
      this.$Message.success(this.$l(this.$l(this.$l(this.$l("设置成功")))));
      await this.getProjectMembers();
    }
  }
  public renderRightForm() {
    const {
      projectInf,
      projectMemberList,
      roleList,
      submitLoading,
      loading,
      addUserInf,
      factTeamMemberList,
    } = this;
    if (this.currentMenuKey === "project") {
      return (
        <div class={[style["right-form"], style["edit-form"]]}>
          <div class={style["form-header"]}>
            <h3>{this.$l(this.$l(this.$l(this.$l("项目信息"))))}</h3>
            <div>
              {this.$l(this.$l(this.$l(this.$l("你可以在这里编辑项目信息。"))))}
            </div>
          </div>
          <div class={style["form-scroll-container"]}>
            <Form value={projectInf} label-position="top">
              <FormItem
                label={this.$l(this.$l(this.$l(this.$l("项目名称"))))}
                prop="name"
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
              <Button
                type="primary"
                onclick={this.onSubmit}
                loading={submitLoading}
              >
                {this.$l(this.$l(this.$l(this.$l("确定"))))}
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div class={[style["right-form"], style["edit-form"]]}>
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
        <div class={style["form-scroll-container"]}>
          <div>
            <h4>{this.$l(this.$l(this.$l(this.$l("添加用户"))))}</h4>
            <div class={style["form-add-user"]}>
              <Select
                v-model={addUserInf.accountId}
                placeholder={this.$l(
                  this.$l(this.$l(this.$l("请从列表中选择用户")))
                )}
              >
                {factTeamMemberList.map((i) => (
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
              <Button type="primary" ghost onclick={this.onAddMember}>
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
              loading={loading}
              scopedSlots={{
                renderItem: (item: ProjectMember) => {
                  const role = roleList.find((i) => i.id === item.roleId);
                  return (
                    <ListItem>
                      <Dropdown
                        slot="actions"
                        on-on-click={(name: string) =>
                          this.handleMemberAction(name, item)
                        }
                      >
                        <div>
                          {role && role.name}
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
                      <div>
                        {item.joinTime}
                        {this.$l(this.$l(this.$l(this.$l("加入项目"))))}
                      </div>
                    </ListItem>
                  );
                },
              }}
            ></List>
          </div>
        </div>
      </div>
    );
  }
  public render() {
    const { project } = this;
    return (
      <Modal
        value={this.visible}
        width={760}
        footer-hide={true}
        class-name={style["edit-project-modal"]}
        on-on-visible-change={(v: boolean) => this.$emit("change", v)}
      >
        <div class={style["left-menu"]}>
          {project && (
            <div class={style["team-inf"]}>
              <div>
                <span>{project.name.charAt(0)}</span>
              </div>
              <div>
                <h2>{project.name}</h2>
                <span title={`项目ID：${project.appid}`}>
                  项目ID：{project.appid}
                </span>
              </div>
            </div>
          )}
          <Menu
            active-name={this.currentMenuKey}
            class={style["team-menu"]}
            style="width: 100%;"
            on-on-select={(name) => (this.currentMenuKey = name)}
          >
            <MenuItem name="project" style="padding-left: 16px;">
              <ProjectList />
              {this.$l(this.$l(this.$l(this.$l("项目信息"))))}
            </MenuItem>
            <MenuItem name="member" style="padding-left: 16px;">
              <Member />
              {this.$l(this.$l(this.$l(this.$l("成员管理"))))}
            </MenuItem>
          </Menu>
        </div>
        {this.renderRightForm()}
      </Modal>
    );
  }
}
