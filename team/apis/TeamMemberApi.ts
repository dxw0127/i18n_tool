import { Api } from "@idg/idg";

export interface TeamMemberLink {
  account_id: string;
  appkey: string;
  channel: string;
  created_at: string;
  id: string;
  team_uuid: string;
}

export default class TeamMemberApi extends Api {
  public all(teamUuid: string): Promise<Array<TeamMemberLink>> {
    return this.request({
      url: "/main.php/json/team/allTeamAccount",
      method: "post",
      data: {
        team_uuid: teamUuid,
      },
    });
  }

  public addByPhone(
    teamUuid: string,
    phone: string,
    url: string
  ): Promise<void> {
    return this.request({
      url: "/main.php/json/team/createInvite",
      method: "post",
      data: {
        team_uuid: teamUuid,
        phone,
        url,
      },
    });
  }

  public remove(teamUuid: string, accountId: string) {
    return this.request({
      url: "/main.php/json/team/deleteAccount",
      method: "post",
      data: {
        team_uuid: teamUuid,
        account_id: accountId,
      },
    });
  }
}
