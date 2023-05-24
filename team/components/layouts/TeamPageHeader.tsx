import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import style from "./layout.module.less";
@Component
export default class TeamPageHeader extends Vue {
  @Prop()
  public title: string;
  public render() {
    const { title } = this;
    const { default: content, extra } = this.$slots;
    return (
      <div class={style["team-page-header"]}>
        <div>
          <h3 class={style["header-title"]}>{title}</h3>
          {content}
        </div>
        <div class={style["header-extra"]}>{extra}</div>
      </div>
    );
  }
}
