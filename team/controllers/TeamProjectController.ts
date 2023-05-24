import { Controller } from "@idg/idg";
import { User, UserApi } from "@idg/ucenter/types";
import _ from "lodash";
import AclApi from "../apis/AclApi";
import ProjectApi, { ProjectUpdateRequest } from "../apis/ProjectApi";
import TeamProjectApi, {
  ProjectApp,
  TeamProjectAddRequest,
} from "../apis/TeamProjectApi";
import UserRoleApi from "../apis/UserRoleApi";
import { store } from "../store";

export interface TeamProject extends ProjectApp {
  label: string;
  web: number;
  wechat: number;
  app: number;
  api: number;
}

export interface ProjectMember extends User {
  roleId: string;
  roleName: string;
  joinTime: string;
}

export default class TeamProjectController extends Controller {
  public static depends = [
    "api.TeamProjectApi",
    "api.ProjectApi",
    "api.AclApi",
    "api.sihpkp4z3rg7wvsozr5lkta9nxxiocqj.user.UserApi",
    "api.UserRoleApi",
  ];
  public teamProjectApi: TeamProjectApi;
  public projectApi: ProjectApi;
  public aclApi: AclApi;
  public userApi: UserApi;
  public userRoleApi: UserRoleApi;

  public async getTeamProjects() {
    await store.teamLoadPromise;
    if (!store.currentTeamUuid) {
      return [];
    }
    const projectList = (
      await this.teamProjectApi.all(store.currentTeamUuid)
    ).map((i) => i.app) as Array<TeamProject>;
    await _.chunk(projectList, 5).reduce(
      async (cb: Promise<void>, projects: Array<TeamProject>) => {
        await cb;
        await Promise.all(
          projects.map(async (item: TeamProject) => {
            const subProjects = (
              await this.projectApi.all({ page: 1, limit: 100, is_delete: 0 }, [
                {
                  appid: "uh49y8vwmxp5rsiqthfjm62ynxbajofc",
                  appkey: item.target_appkey,
                  channel: Number(item.target_channel),
                }, // 开发空间
                {
                  appid: "043fc368aeee4f2791cbfdb01f39abc3",
                  channelAlias: "default",
                }, // GUI
              ])
            ).items;
            (item as any).children = subProjects;
            item.api = subProjects.filter(
              (i) => i.terminal_uuid === "sal20000_org_key210825eaemzm6dyv"
            ).length;
            item.web = subProjects.filter(
              (i) => i.terminal_uuid === "tenx0000_org_key210106eaep579044"
            ).length;
            item.app = subProjects.filter(
              (i) => i.terminal_uuid === "sal20000_org_key210207eaeocd79qo"
            ).length;
            item.wechat = subProjects.filter(
              (i) => i.terminal_uuid === "tenx0000_org_key210106eaep4e904h"
            ).length;
          })
        );
      },
      undefined
    );

    return projectList;
  }

  public async createProject(data: Omit<TeamProjectAddRequest, "team_uuid">) {
    return await this.teamProjectApi.add({
      ...data,
      type: "app",
      sub_type: "app_dev",
      team_uuid: await this.$idg.storage.getItem("userTeamUuid"),
    });
  }

  public async removeProject(appid: string) {
    return await this.teamProjectApi.remove(
      await this.$idg.storage.getItem("userTeamUuid"),
      appid
    );
  }

  public updateProjectInf(data: ProjectUpdateRequest) {
    return this.projectApi.update(data);
  }

  public async getProjectMembers(project: TeamProject) {
    const accounts = (
      await this.aclApi.getChannelAccounts(
        {
          page: 1,
          limit: 999,
        },
        [
          {
            appid: "uh49y8vwmxp5rsiqthfjm62ynxbajofc",
            appkey: project.target_appkey,
            channel: Number(project.target_channel),
          }, // 开发空间
          {
            appid: "dwvzflvcgqgkmtqumindtwrylbakozn3",
            channelAlias: "default",
          }, // ACL
        ]
      )
    ).items;

    if (!Object.keys(accounts).length) {
      return [];
    }

    const users = await this.userApi.allByAccounts({
      account_ids: Object.keys(accounts),
    });

    return users
      .map((user) => {
        const role = accounts[user.account_id] && accounts[user.account_id][0];
        if (!role) {
          return undefined;
        }
        return {
          ...user,
          roleId: role.roleId,
          roleName: role.name,
          joinTime: role.created,
        };
      })
      .filter((i) => i);
  }

  public async setProjectMemberRole(
    project: TeamProject,
    accountId: string,
    roleId: string
  ) {
    return this.userRoleApi.setUserRole(
      {
        accountId: accountId,
        roleIds: [roleId],
      },
      [
        {
          appid: "uh49y8vwmxp5rsiqthfjm62ynxbajofc",
          appkey: project.target_appkey,
          channel: Number(project.target_channel),
        }, // 开发空间
        { appid: "dwvzflvcgqgkmtqumindtwrylbakozn3", channelAlias: "default" }, // ACL
      ]
    );
  }

  public async removeProjectMember(
    project: TeamProject,
    accountId: string,
    roleId: string
  ) {
    return this.userRoleApi.deleteUserRole(
      {
        accountId: accountId,
        roleIds: [roleId],
      },
      [
        {
          appid: "uh49y8vwmxp5rsiqthfjm62ynxbajofc",
          appkey: project.target_appkey,
          channel: Number(project.target_channel),
        }, // 开发空间
        { appid: "dwvzflvcgqgkmtqumindtwrylbakozn3", channelAlias: "default" }, // ACL
      ]
    );
  }
}
