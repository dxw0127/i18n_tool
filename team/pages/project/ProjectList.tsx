import { Component, Vue } from "vue-property-decorator";
import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Col,
  Row,
  Spin,
} from "@idg/iview";
import style from "./project.module.less";
import TeamProjectController, {
  TeamProject,
} from "../../controllers/TeamProjectController";
@Component({
  depends: [
    "component.TeamLayout",
    "component.TeamPageHeader",
    "component.CreateProject",
    "component.EditProject",
    "controller.TeamProjectController",
  ],
})
export default class ProjectList extends Vue {
  public teamProjectController: TeamProjectController;
  public loading = false;
  public projectList: Array<TeamProject> = [];
  public createVisible = false;
  public editVisible = false;
  public editProject: TeamProject | null = null;
  public created() {
    this.getList();
  }
  public async getList() {
    this.loading = true;
    try {
      this.projectList = await this.teamProjectController.getTeamProjects();
    } catch (e) {
      this.$Message.error(this.$l(this.$l(this.$l(this.$l("获取失败")))));
    }
    this.loading = false;
  }
  public handleCardClick(project: TeamProject) {
    this.$router.push({
      name: "gui-huawei-main",
      params: {
        appid: project.appid,
        version: "0.0.0",
        devAppkey: project.target_appkey,
        devChannel: project.target_channel,
      },
    });
  }
  public handleDropdownClick(project: TeamProject, name: string) {
    if (name === "remove") {
      this.$Modal.confirm({
        title: this.$l(this.$l(this.$l(this.$l("确认删除吗？")))),
        onOk: async () => {
          await this.teamProjectController.removeProject(project.appid);
          this.$Message.success(this.$l(this.$l(this.$l(this.$l("删除成功")))));
          await this.getList();
        },
      });
    } else if (name === "setting") {
      this.editVisible = true;
      this.editProject = project;
    }
  }
  public renderProjectList() {
    const { projectList, loading } = this;
    if (loading) {
      return <Spin fix></Spin>;
    }
    if (!projectList.length) {
      return (
        <div class={style["project-list-empty"]}>
          <div class={style["main-content"]}>
            <img src={require("../../assets/imgs/project-empty.png")} />
            <div>
              {this.$l(this.$l(this.$l(this.$l("您还没添加任何项目"))))}
            </div>
            <Button type="primary" onclick={() => (this.createVisible = true)}>
              {this.$l(this.$l(this.$l(this.$l("立即添加"))))}
            </Button>
          </div>
        </div>
      );
    }
    const list = this.projectList.map((project) => {
      return (
        <div class={style["project-item-card-container"]} key={project.appid}>
          <div
            class={style["project-item-card"]}
            onclick={() => this.handleCardClick(project)}
          >
            <div class={style["card-header"]}>
              <div>
                <img src={require("../../assets/imgs/project-icon.svg")} />
              </div>
              <div>
                <div class={[style["card-header-title"], "clearfix"]}>
                  <h3>{project.name}</h3>
                  <div onclick={(e: Event) => e.stopPropagation()}>
                    <Dropdown
                      on-on-click={(name: string) =>
                        this.handleDropdownClick(project, name)
                      }
                    >
                      <img src={require("../../assets/imgs/more.svg")} />
                      <DropdownMenu slot="list">
                        <DropdownItem name="setting" style="color: #666;">
                          {this.$l(this.$l(this.$l(this.$l("设置"))))}
                        </DropdownItem>
                        <DropdownItem name="remove" style="color: #F5222D;">
                          {this.$l(this.$l(this.$l(this.$l("删除"))))}
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
                <div
                  title={`项目ID：${project.appid}`}
                  class={style["card-header-content"]}
                >
                  项目ID：{project.appid}
                </div>
              </div>
            </div>
            <div class={style["card-content"]}>
              <div>
                <img src={require("../../assets/imgs/web.svg")} />
                <div>web({project.web})</div>
              </div>
              <div>
                <img src={require("../../assets/imgs/wechat.svg")} />
                <div>微信小程序({project.wechat})</div>
              </div>
              <div>
                <img src={require("../../assets/imgs/app.svg")} />
                <div>APP({project.app})</div>
              </div>
              <div>
                <img src={require("../../assets/imgs/api.svg")} />
                <div>API({project.api})</div>
              </div>
            </div>
            <div class={style["card-footer"]}>
              <div>更新时间：{project.updated_at}</div>
              {/* <div>部署时间：</div> */}
            </div>
          </div>
        </div>
      );
    });
    return <div class={style["project-list"]}>{list}</div>;
  }
  public render() {
    return (
      <div class={style["project"]}>
        <team-page-header
          title={this.$l(this.$l(this.$l(this.$l("项目列表"))))}
          backIcon={false}
        >
          <Button
            type="primary"
            slot="extra"
            onclick={() => (this.createVisible = true)}
          >
            {this.$l(this.$l(this.$l(this.$l("创建项目"))))}
          </Button>
          <div>你可以编辑、查看、打开所选择的项目，或者创建新的项目</div>
        </team-page-header>
        {this.renderProjectList()}
        <create-project v-model={this.createVisible} on-update={this.getList} />
        <edit-project
          v-model={this.editVisible}
          project={this.editProject}
          on-update={this.getList}
        />
      </div>
    );
  }
}
