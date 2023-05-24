import { UserCurTeamInfo } from "../apis/TeamApi";
import Vue from "vue";
import { User } from "@idg/ucenter";

export class Store {
  public currentTeamUuid = "";
  public teamLoadPromise: Promise<UserCurTeamInfo> | null = null;
  public currentUserInf: User = null;
  public currentTeamInf: UserCurTeamInfo | null = null;

  public setTeamInf(inf: UserCurTeamInfo) {
    this.currentTeamInf = inf;
    this.currentTeamUuid = inf.team_uuid;
  }

  public setUserInf(inf: User) {
    this.currentUserInf = inf;
  }
}

export const store = Vue.observable(new Store());
