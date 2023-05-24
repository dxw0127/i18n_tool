import { Api, RequestStack } from "@idg/idg";

export default class UserRoleApi extends Api {
  public setUserRole(
    data: {
      accountId: string;
      roleIds?: string[]; // 不传或者长度为0则传给后端noRole
      extras?: string;
      targetId?: string;
    },
    requestStack: RequestStack
  ): Promise<void> {
    return this.idg
      .callApi({
        url: "/index.php/User/setUserRole",
        method: "post",
        data: { ...data },
        requestStack,
      })
      .then((res: any) => res.data);
  }

  public deleteUserRole(
    data: {
      accountId?: string;
      roleIds?: string[];
      extras?: string;
    },
    requestStack: RequestStack
  ) {
    return this.idg
      .callApi({
        url: "/index.php/User/deleteUserRole",
        method: "post",
        data,
        requestStack,
      })
      .then((res: any) => res.data);
  }
}
