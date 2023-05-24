import { UserRoleApi } from "@idg/acl/types";
import { Controller } from "@idg/idg";
import { User, UserApi } from "@idg/ucenter/types";
import TeamMemberApi, { TeamMemberLink } from "../apis/TeamMemberApi";
import { store } from "../store";

export type TeamMember = TeamMemberLink & User;

export default class TeamMemberController extends Controller {
  public static depends = [
    "api.TeamMemberApi",
    "api.sihpkp4z3rg7wvsozr5lkta9nxxiocqj.user.UserApi",
    "api.dwvzflvcgqgkmtqumindtwrylbakozn3.acl-admin.UserRoleApi",
  ];
  public teamMemberApi: TeamMemberApi;
  public userApi: UserApi;
  public userRoleApi: UserRoleApi;

  public async getAllMembers() {
    await store.teamLoadPromise;
    if (!store.currentTeamUuid) {
      return [];
    }
    const list = (await this.teamMemberApi.all(
      store.currentTeamUuid
    )) as TeamMember[];

    if (!list.length) {
      return [];
    }

    const idMap = list.reduce((r, i) => {
      r[i.account_id] = i;
      return r;
    }, {});

    const userList = await this.userApi.allByAccounts({
      account_ids: Object.keys(idMap),
    });
    userList.forEach((user) => {
      const teamMember = idMap[user.account_id];
      if (!teamMember) {
        return;
      }
      Object.assign(teamMember, user, { created_at: teamMember.created_at });
    });

    return list;
  }

  public async addMemberByPhone(phone: string, url: string) {
    return await this.teamMemberApi.addByPhone(
      await this.$idg.storage.getItem("userTeamUuid"),
      phone,
      url
    );
  }

  public async removeMember(accountId: string) {
    return await this.teamMemberApi.remove(
      await this.$idg.storage.getItem("userTeamUuid"),
      accountId
    );
  }
}
