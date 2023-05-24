import { Controller } from "@idg/idg";
import TeamApi, { TeamInfo } from "../apis/TeamApi";
import _ from "lodash";
import { store } from "../store";

export default class TeamController extends Controller {
  public static depends = ["api.TeamApi"];
  public teamApi: TeamApi;

  /**
   * 处理获取当前用户登录团队
   */
  public async handleAccountCurTeam() {
    store.teamLoadPromise = this.teamApi.getAccountCurTeam();
    const res = await store.teamLoadPromise;
    store.setTeamInf(res);
    await this.$idg.storage.setItem("userTeamUuid", res.team_uuid);
    return res;
  }

  public async handleSetAccountCurTeam(team_uuid: string) {
    const res = await this.teamApi.setAccountCurTeam({ team_uuid });
    return res;
  }

  public async handleNewTeam(label: string) {
    const res = await this.teamApi.newTeam({ label });
    return res;
  }

  public async updateTeamInfo(data: Partial<TeamInfo> & { uuid: string }) {
    return this.teamApi.update(data);
  }

  public async handleGetTeamDetail(data: { uuid?: string; id?: string }) {
    const res = await this.teamApi.getTeamDetail(data);
    return res;
  }

  public async handleJoinTeamByUuid(uuid: string) {
    const res = await this.teamApi.joinTeamByUuid({ team_uuid: uuid });
    return res;
  }

  public async handleMyTeamList() {
    const res = await this.teamApi.myTeamList();
    return res;
  }

  public async handleLeaveTeam(uuid: string) {
    const res = await this.teamApi.leaveTeam({ team_uuid: uuid });
    return res;
  }
}
