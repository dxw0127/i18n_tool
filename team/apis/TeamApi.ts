import { Api } from "@idg/idg";
import { AxiosRequestConfig } from "axios";

export interface TeamInfo {
  uuid: string;
  label: string;
  business: string;
  company_introduce: string;
  company_name: string;
  contact_phone: string;
  create_account_id: string;
  website: string;
  invite_url_status: string;
}

export interface UserCurTeamInfo {
  id: string;
  appkey: string;
  channel: string;
  account_id: string;
  team_uuid: string;
  team: TeamInfo;
  is_delete: string;
  created_at: string;
  updated_at: string;
}

export interface TeamDetail {
  id: string; // id
  appkey: string; // appkey
  channel: string; // channel
  uuid: string; // uuid
  label: string; // label
  company_name: string; // company_name
  company_introduce: string; // company_introduce
  business: string; // business
  website: string; // website
  contact_phone: string; // contact_phone
  create_account_id: string; // create_account_id
  is_delete: string; // is_delete
  created_at: string; // created_at
  updated_at: string; // updated_at
  invite_url_status: string;
}

export default class TeamApi extends Api {
  /**
   * 获取当前用户登录团队
   * @returns
   */
  public getAccountCurTeam(): Promise<UserCurTeamInfo> {
    const request: AxiosRequestConfig = {
      url: "/main.php/json/team/getAccountLastTeam",
      method: "post",
    };

    return this.request(request);
  }

  /**
   *记录当前用户登录团队
   * @param data
   * @returns
   */
  public setAccountCurTeam(data: { team_uuid: string }): Promise<string> {
    const request: AxiosRequestConfig = {
      url: "/main.php/json/team/saveAccountLastTeam",
      method: "post",
      data,
    };

    return this.request(request);
  }

  /**
   *新增团队
   * @param data
   * @returns
   */
  public newTeam(data: { label: string }): Promise<string> {
    const request: AxiosRequestConfig = {
      url: "/main.php/json/team/add",
      method: "post",
      data: data,
    };

    return this.request(request);
  }

  public update(data: Partial<TeamInfo> & { uuid: string }) {
    return this.request({
      url: "/main.php/json/team/update",
      method: "post",
      data,
    });
  }

  /**
   * 获取团队详情
   * @param data uuid 团队uuid  id: 团队id
   * @returns
   */
  public getTeamDetail(data: {
    uuid?: string;
    id?: string;
  }): Promise<TeamDetail> {
    const request: AxiosRequestConfig = {
      url: "/main.php/json/team/teamDetail",
      method: "post",
      data: data,
    };

    return this.request(request);
  }

  /**
   * 根据uuid加入团队
   * @param data
   * @returns
   */
  public joinTeamByUuid(data: { team_uuid: string }): Promise<string> {
    const request: AxiosRequestConfig = {
      url: "/main.php/json/team/joinTeam",
      method: "post",
      data: data,
    };

    return this.request(request);
  }

  /**
   * 我的团队列表
   * @returns
   */
  public myTeamList(): Promise<TeamDetail[]> {
    const request: AxiosRequestConfig = {
      url: "/main.php/json/team/myTeamList",
      method: "post",
    };

    return this.request(request);
  }

  public leaveTeam(data: { team_uuid: string }): Promise<TeamDetail[]> {
    const request: AxiosRequestConfig = {
      url: "/main.php/json/team/leaveTeam",
      method: "post",
      data,
    };

    return this.request(request);
  }
}
