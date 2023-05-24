import { Component, Vue } from "vue-property-decorator";
import { Layout, Sider, Content, Menu, MenuItem } from "@idg/iview";
import Project from "../../assets/imgs/project.csvg";
import Setting from "../../assets/imgs/setting.csvg";
import Team from "../../assets/imgs/team.csvg";
import Fee from "../../assets/imgs/fee.csvg";
import style from "./layout.module.less";
import { store } from "../../store";
@Component({
  depends: ["component.HeaderLayout", "controller.TeamController"],
})
export default class TeamLayout extends Vue {
  public render() {
    const { currentTeamInf } = store;
    const team = currentTeamInf && currentTeamInf.team;
    return (
      <header-layout>
        <Layout class={style["team-content-layout"]}>
          <Sider class={style["team-sider"]} width={192}>
            {currentTeamInf && team && (
              <div class={style["team-inf"]}>
                <div>
                  <span>{team.label.substring(0, 1)}</span>
                </div>
                <div>
                  <h2>{team.label}</h2>
                  <span title={`团队ID：${team.uuid}`}>
                    团队ID：{team.uuid}
                  </span>
                </div>
              </div>
            )}
            <Menu
              active-name={this.$route.name}
              class={style["team-menu"]}
              style="width: 100%;"
              on-on-select={(name) =>
                this.$router.push({
                  name,
                })
              }
            >
              <MenuItem name="team-project-list" style="padding-left: 16px;">
                <Project />
                {this.$l(this.$l(this.$l(this.$l("项目列表"))))}
              </MenuItem>
              <MenuItem name="team-common-setting" style="padding-left: 16px;">
                <Setting />
                {this.$l(this.$l(this.$l(this.$l("通用设置"))))}
              </MenuItem>
              <MenuItem name="team-setting" style="padding-left: 16px;">
                <Team />
                {this.$l(this.$l(this.$l(this.$l("团队管理"))))}
              </MenuItem>
              <MenuItem name="resource" style="padding-left: 16px;">
                <Fee />
                {this.$l(this.$l(this.$l(this.$l("费用中心"))))}
              </MenuItem>
            </Menu>
          </Sider>
          <Content
            class={style["team-content"]}
            key={currentTeamInf && currentTeamInf.team_uuid}
          >
            <router-view></router-view>
          </Content>
        </Layout>
      </header-layout>
    );
  }
}
