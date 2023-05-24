import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Modal, Form, FormItem, Input } from "@idg/iview";
import styles from "./style.module.less";
import TeamController from "../../controllers/TeamController";
@Component({
  depends: ["controller.TeamController"],
})
export default class IntoTeamModal extends Vue {
  teamController: TeamController;
  @Prop()
  public visible: boolean;
  public isShowModal: boolean = false;
  formInline: {
    [prop: string]: string;
  } = {
    code: "",
  };
  ruleInline: any = {
    code: [
      {
        required: true,
        message: this.$l(this.$l(this.$l(this.$l("请输入邀请链接")))),
        trigger: "blur",
      },
      {
        type: "string",
        pattern:
          /(https?:\/\/)?(([\da-z\.-]+)\.([a-z]{2,6}))|(localhost)(:\d{1,5})?([\/\w\.-]*)*\/?(#[\S]+)?/,
        message: this.$l(this.$l(this.$l(this.$l("邀请链接格式错误")))),
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
        window.open(this.formInline.code, "_self");
        // this.$router.push({ path: this.formInline.code });
      }
    });
  }

  public render() {
    const { ruleInline, formInline } = this;
    return (
      <Modal
        v-model={this.isShowModal}
        title={this.$l(this.$l(this.$l(this.$l("加入团队"))))}
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
        ok-closable={false}
        mask-closable={false}
        // loading={this.loading}
      >
        <div class={styles["newTeamContent"]}>
          <Form
            class={styles["form"]}
            ref="formInline"
            value={formInline}
            rules={ruleInline}
          >
            <FormItem prop="code">
              <div class={styles["formItemLabel"]}>
                {this.$l(this.$l(this.$l(this.$l("邀请链接"))))}
              </div>
              <Input
                type="text"
                v-model={formInline.code}
                placeholder={this.$l(
                  this.$l(this.$l(this.$l("请输入邀请链接")))
                )}
              ></Input>
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  }
}
