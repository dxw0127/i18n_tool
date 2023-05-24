import { Component, Vue } from "vue-property-decorator";
import { Button, Tabs, TabPane } from "@idg/iview";
import styles from "./style.module.less";
@Component({
  depends: [
    "component.HeaderLayout",
    "component.UserInfo",
    "component.UserAccount",
    "component.TeamSetting",
  ],
  components: {},
})
export default class Setting extends Vue {
  curSetting: string = "userInfo";
  public created() {
    this.getList();
  }
  public getList() {}
  public render() {
    const { curSetting } = this;
    return (
      <div>
        <header-layout>
          <div class={styles["settingContainer"]}>
            <Tabs class={styles["settingTab"]} v-model={curSetting}>
              <TabPane
                label={this.$l(this.$l(this.$l(this.$l("用户信息"))))}
                name="userInfo"
              >
                <user-info></user-info>
              </TabPane>
              <TabPane
                label={this.$l(this.$l(this.$l(this.$l("安全设置"))))}
                name="userAccount"
              >
                <user-account></user-account>
              </TabPane>
              <TabPane
                label={this.$l(this.$l(this.$l(this.$l("团队设置"))))}
                name="team"
              >
                <team-setting></team-setting>
              </TabPane>
            </Tabs>
          </div>
        </header-layout>
      </div>
    );
  }
}
