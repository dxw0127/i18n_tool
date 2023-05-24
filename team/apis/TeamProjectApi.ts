import { Api } from "@idg/idg";

export interface ProjectApp {
  name: string;
  type: string;
  sub_type: string;
  img: string;
  desc: string;
  appkey: string;
  channel: string;
  appid: string;
  target_appkey: string;
  target_channel: string;
  updated_at: string;
}

export interface TeamProjectLink {
  id: string;
  appid: string;
  appkey: string;
  channel: string;
  team_uuid: string;
  app: ProjectApp;
  target_appkey: string;
  target_channel: number;
}

export interface TeamProjectAddRequest {
  name: string;
  type?: string;
  sub_type?: string;
  img?: string;
  desc?: string;
  appkey?: string;
  channel?: string;
  team_uuid: string;
  user_arr: Array<{ account_id: string; role: string }>;
}

export default class TeamProjectApi extends Api {
  public constructor() {
    super({
      timeout: 60000, // 20秒 ---> 5秒
    });
  }

  public all(teamUuid: string): Promise<Array<TeamProjectLink>> {
    return this.request({
      url: "/main.php/json/team/allAppByTeam",
      method: "post",
      data: {
        team_uuid: teamUuid,
      },
    });
  }

  public add(data: TeamProjectAddRequest) {
    return this.request({
      url: "/main.php/json/app/createForTeam",
      method: "post",
      data,
    });
  }

  public remove(team_uuid: string, appid: string) {
    return this.request({
      url: "/main.php/json/team/removeApp",
      method: "post",
      data: {
        team_uuid,
        appid,
      },
    });
  }
}
