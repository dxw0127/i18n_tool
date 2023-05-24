import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Modal, Form, FormItem, Input } from "@idg/iview";
import styles from "./style.module.less";
import TeamController from "../../controllers/TeamController";
@Component({
  depends: ["controller.TeamController"],
})
export default class NewTeamModal extends Vue {
  teamController: TeamController;
  @Prop()
  public visible: boolean;
  public loading: boolean = true;
  public isShowModal: boolean = false;
  formInline: {
    [prop: string]: string;
  } = {
    name: "",
  };
  ruleInline: any = {
    name: [
      {
        required: true,
        message: this.$l(this.$l(this.$l(this.$l("请输入团队名")))),
        trigger: "blur",
      },
      {
        type: "string",
        min: 3,
        message: "团队名称不能少于3个字符",
        trigger: "blur",
      },
    ],
  };
  @Watch("visible", {
    immediate: true,
  })
  public watchVisible() {
    this.isShowModal = this.visible;
  }
  handleSubmit() {
    (this.$refs["formInline"] as Form).validate(async (valid) => {
      if (valid) {
        this.loading = true;
        try {
          const teamUuid = await this.teamController.handleNewTeam(
            this.formInline.name
          );

          // const res = await this.teamController.handleSetAccountCurTeam(teamUuid);

          this.$Message.success(
            this.$l(this.$l(this.$l(this.$l("新建成功！"))))
          );
          this.loading = false;
          this.$nextTick(() => {
            this.loading = true;
          });
          this.$emit("success");
          this.$emit("visible-change", false);
          // 成功后跳转到主页

          // this.$router.push({ name: 'team-project-list' });
        } catch (e) {
          this.loading = false;
          this.$nextTick(() => {
            this.loading = true;
          });
          this.$Message.error(e.message);
        }
      } else {
        this.loading = false;
        this.$nextTick(() => {
          this.loading = true;
        });
        // this.$Message.error('账户名和密码错误!');
      }
    });
  }

  public render() {
    const { ruleInline, formInline } = this;
    return (
      <Modal
        v-model={this.isShowModal}
        title={this.$l(this.$l(this.$l(this.$l("新建团队"))))}
        // footer-hide={true}
        width={480}
        class={styles["newTeamContainer"]}
        on-on-cancel={() => {
          this.isShowModal = false;
          this.$emit("visible-change", false);
        }}
        on-on-ok={() => {
          this.handleSubmit();
        }}
        loading={this.loading}
      >
        <div class={styles["newTeamContent"]}>
          <Form
            class={styles["form"]}
            ref="formInline"
            value={formInline}
            rules={ruleInline}
          >
            <FormItem prop="name">
              <div class={styles["formItemLabel"]}>
                {this.$l(this.$l(this.$l(this.$l("给你的团队取个名字"))))}
              </div>
              <Input
                type="text"
                v-model={formInline.name}
                placeholder={this.$l(
                  this.$l(this.$l(this.$l("请输入团队名称")))
                )}
              ></Input>
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  }
}
