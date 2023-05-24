import {
  ProjectAllRequest,
  ProjectAllResponse,
} from "@idg/gui/types/core/interfaces/db_project";
import { Api, RequestStack } from "@idg/idg";

export interface ProjectUpdateRequest {
  appid: string;
  name: string;
  desc?: string;
}

export default class ProjectApi extends Api {
  public all(
    data: ProjectAllRequest,
    requestStack: RequestStack
  ): Promise<ProjectAllResponse> {
    return this.idg
      .callApi({
        url: "index.php/Project/all",
        method: "post",
        data: { ...data },
        requestStack,
      })
      .then((res: any) => res.data);
  }

  public update(data: ProjectUpdateRequest) {
    return this.idg
      .callApi({
        url: "/main.php/json/app/edit",
        method: "post",
        data,
        requestStack: [],
      })
      .then((res: any) => res.data);
  }
}
