import { GetChannelAccountsResponse } from "@idg/acl/types";
import { Api } from "@idg/idg";

export default class AclApi extends Api {
  public getChannelAccounts(
    data: {
      targetId?: string;
      page: number;
      limit: number;
    },
    requestStack
  ): Promise<{
    items: GetChannelAccountsResponse;
    totalCount: number;
  }> {
    return this.idg
      .callApi({
        url: "/index.php/User/getChannelAccounts",
        method: "post",
        data: { ...data },
        requestStack,
      })
      .then((res: any) => res.data);
  }

  public set;
}
