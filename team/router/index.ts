export const routes = [
  {
    path: "/login",
    name: "team-login",
    page: "TeamLoginPage",
  },
  {
    path: "/team/sign-in",
    name: "team-sign-in",
    page: "TeamSignInPage",
  },
  {
    path: "/team/invite",
    name: "team-invite",
    page: "TeamInvitePage",
  },
  {
    path: "/team/into-team",
    name: "into-team",
    page: "IntoTeamPage",
  },
  {
    path: "/team/reset-password",
    name: "reset-password",
    page: "ResetPassword",
  },
  {
    path: "/team",
    name: "team",
    page: "TeamLayout",
    children: [
      {
        path: "project-list",
        name: "team-project-list",
        page: "TeamProjectList",
      },
      {
        path: "common-setting",
        name: "team-common-setting",
        page: "TeamCommonSetting",
      },
      {
        path: "setting",
        name: "team-setting",
        page: "TeamSetting",
      },
    ],
  },
  {
    path: "/team/user-setting",
    name: "team-user-setting",
    page: "SettingPage",
  },
];
