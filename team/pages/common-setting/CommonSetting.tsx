import { Button, Form, FormItem, Input } from "@idg/iview";
import { Component, Vue } from "vue-property-decorator";
import TeamController from "../../controllers/TeamController";
import { store } from "../../store";
import style from "./common-setting.module.less";
@Component({
  depends: [
    "component.TeamLayout",
    "component.TeamPageHeader",
    "controller.TeamController",
  ],
})
export default class CommonSetting extends Vue {
  public teamController: TeamController;
  public nameEditable = false;
  public formEditable = false;
  public teamInf = {
    uuid: "",
    name: "",
    fullName: "",
    business: "",
    website: "",
    contact: "",
    intro: "",
  };
  public editName() {
    const { team } = store.currentTeamInf;
    this.teamInf = {
      uuid: team.uuid,
      name: team.label,
      fullName: team.company_name,
      business: team.website,
      website: team.website,
      contact: team.contact_phone,
      intro: team.company_introduce,
    };
    this.nameEditable = true;
  }
  public editForm() {
    const { team } = store.currentTeamInf;
    this.teamInf = {
      uuid: team.uuid,
      name: team.label,
      fullName: team.company_name,
      business: team.website,
      website: team.website,
      contact: team.contact_phone,
      intro: team.company_introduce,
    };
    this.formEditable = true;
  }
  public async saveName() {
    const { teamInf } = this;
    // 接口要求全部数据
    await this.teamController.updateTeamInfo({
      uuid: teamInf.uuid,
      label: teamInf.name,
      company_name: teamInf.fullName,
      business: teamInf.business,
      website: teamInf.website,
      contact_phone: teamInf.contact,
      company_introduce: teamInf.intro,
    });
    await this.teamController.handleAccountCurTeam();
    this.$Message.success(this.$l(this.$l(this.$l(this.$l("修改成功")))));
    this.nameEditable = false;
  }
  public async onSubmit() {
    const { teamInf } = this;
    // 接口要求全部数据
    await this.teamController.updateTeamInfo({
      uuid: teamInf.uuid,
      label: teamInf.name,
      company_name: teamInf.fullName,
      business: teamInf.business,
      website: teamInf.website,
      contact_phone: teamInf.contact,
      company_introduce: teamInf.intro,
    });
    await this.teamController.handleAccountCurTeam();
    this.$Message.success(this.$l(this.$l(this.$l(this.$l("修改成功")))));
    this.formEditable = false;
  }
  public render() {
    const { formEditable, teamInf, nameEditable } = this;
    if (!store.currentTeamInf) {
      return <div></div>;
    }
    const { team } = store.currentTeamInf;
    return (
      <div>
        <team-page-header
          title={this.$l(this.$l(this.$l(this.$l("通用设置"))))}
          backIcon={false}
        >
          <div>{this.$l(this.$l(this.$l(this.$l("管理团队和工作区"))))}</div>
        </team-page-header>
        <div class={[style["card"], style["team-header"]]}>
          <div class={style["logo"]}>
            <div>{team.label.charAt(0)}</div>
          </div>
          <div>
            <h3>
              {nameEditable ? (
                <Input v-model={teamInf.name}>
                  <Button type="primary" slot="append" onclick={this.saveName}>
                    {this.$l(this.$l(this.$l(this.$l("保存"))))}
                  </Button>
                </Input>
              ) : (
                team.label
              )}
              {!this.nameEditable && (
                <img
                  src={require("../../assets/imgs/edit.svg")}
                  onclick={this.editName}
                />
              )}
            </h3>
            <div>团队ID：{team.uuid}</div>
          </div>
        </div>
        <div class={[style["card"], style["team-content"]]}>
          <div class="clearfix">
            <h3>{this.$l(this.$l(this.$l(this.$l("团队信息"))))}</h3>
            {!formEditable && (
              <Button type="primary" onclick={this.editForm}>
                {this.$l(this.$l(this.$l(this.$l("编辑"))))}
              </Button>
            )}
            {formEditable && (
              <Button type="primary" onclick={this.onSubmit}>
                {this.$l(this.$l(this.$l(this.$l("保存"))))}
              </Button>
            )}
            {formEditable && (
              <Button
                onclick={() => (this.formEditable = false)}
                style="margin: 0 8px 8px 0;"
              >
                {this.$l(this.$l(this.$l(this.$l("取消"))))}
              </Button>
            )}
          </div>
          <Form
            value={teamInf}
            colon={true}
            label-width={200}
            label-position="left"
            class={formEditable && style["form-editable"]}
          >
            <FormItem
              label={this.$l(this.$l(this.$l(this.$l("公司名称"))))}
              prop="fullName"
            >
              {formEditable ? (
                <Input v-model={teamInf.fullName} />
              ) : (
                team.company_name
              )}
            </FormItem>
            <FormItem
              label={this.$l(this.$l(this.$l(this.$l("主营业务"))))}
              prop="business"
            >
              {formEditable ? (
                <Input v-model={teamInf.business} />
              ) : (
                team.business
              )}
            </FormItem>
            <FormItem
              label={this.$l(this.$l(this.$l(this.$l("网站链接"))))}
              prop="website"
            >
              {formEditable ? (
                <Input v-model={teamInf.website} />
              ) : (
                team.website
              )}
            </FormItem>
            <FormItem
              label={this.$l(this.$l(this.$l(this.$l("联系电话"))))}
              prop="contact"
            >
              {formEditable ? (
                <Input v-model={teamInf.contact} />
              ) : (
                team.contact_phone
              )}
            </FormItem>
            <FormItem
              label={this.$l(this.$l(this.$l(this.$l("公司简介"))))}
              prop="intro"
            >
              {formEditable ? (
                <Input v-model={teamInf.intro} type="textarea" />
              ) : (
                team.company_introduce
              )}
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}
