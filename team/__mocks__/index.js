const Mock = require("mockjs");
const receiveProtocol = require("./receiveProtocol.json");
const transferProtocol = require("./transferProtocol.json");
receiveProtocol.properties.user_info_arr = JSON.stringify(
  receiveProtocol.properties.user_info_arr
);
receiveProtocol.properties = JSON.stringify(receiveProtocol.properties);
const detail = Mock.mock({
  avakuebate: {
    org: {
      sub_org_key: "@word(32)",
      org_name: "@ctitle(3, 5)",
    },
    target: {
      name: "@ctitle(3, 5)",
      appkey: "@word(32)",
      channel: "@integer",
    },
    accounts: [
      {
        account_id: "@word(32)",
        user_name: "@cname()",
        avatar_url: "@url()",
        email: "@email()",
        role_name: "拥有者",
        role_key: "@word(32)",
      },
      {
        account_id: "@word(32)",
        user_name: "@cname()",
        avatar_url: "@url()",
        email: "@email()",
        role_name: "成员",
        role_key: "@word(32)",
      },
    ],
    validity: "长期有效",
  },
  resource: [
    {
      source_plat: "运营商——智人云",
      source_plat_key: "@word(32)",
      region: "华东—南京",
      mode: "独享部署",
      effect_at: "2020-01-01",
      expire_at: "2020-12-30",
      pay_method: "包年包月",
      price: 10,
      sku: "容器-1vCPU 2Gib",
      quota: 3,
    },
    {
      source_plat: "运营商——智人云",
      source_plat_key: "@word(32)",
      region: "华东—南京",
      mode: "共享部署",
      effect_at: "2020-01-01",
      expire_at: "2020-12-30",
      pay_method: "包年包月",
      price: 11,
      sku: "容器-1vCPU 2Gib",
      quota: 2,
    },
  ],
});
module.exports = {
  "POST /main.php/json/app/create": function (req, res) {
    res.send({
      state: 1,
      data: 1,
    });
  },
  "POST /main.php/json/app/edit": function (req, res) {
    res.send({
      state: 1,
      data: 1,
    });
  },
  "POST /main.php/json/app/delete": function (req, res) {
    res.send({
      state: 1,
      data: 1,
    });
  },
  "POST /main.php/json/watch_history/update_history": function (req, res) {
    res.send({
      state: 1,
      data: 1,
    });
  },
  "POST /main.php/json/role/getPermissionOfUser": function (req, res) {
    res.send({
      state: 1,
      data: {
        "fnue42okwlghuw5tohvmbsxqiz1amgcz.uh49y8vwmxp5rsiqthfjm62ynxbajofc[].dwvzflvcgqgkmtqumindtwrylbakozn3.default":
          [
            "developworkplace.enterApp",
            "developworkplace.editApp",
            "developworkplace.deleteApp",
          ],
      },
    });
  },
  "POST /main.php/json/app/getList": function (req, res) {
    res.send({
      state: 1,
      data: Mock.mock({
        total: 101,
        [`items|${10}`]: [
          {
            "id|+1": 100,
            appid: "@word(32)",
            target_appkey: "@word(32)",
            target_channel: "@integer",
            name: "@ctitle(5, 10)",
            account_id: "@word(32)",
            "app_type|1": ["app"],
            sub_type: "app",
            member_count: "@integer(1, 100)",
            space_id: "@word(32)",
            "state|1": ["normal"],
            "tag|1": ["space_v1", "space_v2"],
            version: /[0-9]\.[0-9]\.[0-9]/,
          },
        ],
      }),
    });
  },
  "POST /main.php/json/transfer_record/detail": function (req, res) {
    res.send({
      state: 1,
      data: Mock.mock({
        "id|+1": 100,
        key: "@word(32)",
        name: "@ctitle(5, 10)",
        "type|1": [1, 2, 3],
        "is_contain_resource|1": [0, 1],
        resource: JSON.stringify(detail.resource),
        develop_space_appkey: "@word(32)",
        develop_space_channel: "@integer",
        "state|1": [1, 2, 3],
        result: "@cword(16)",
        avakuebate: JSON.stringify(detail.avakuebate),
        remark: "@cword(12)",
        account_id: "@word(32)",
        user_name: "@cname()",
        did: "@word(16)",
      }),
    });
  },
  "POST /main.php/json/transfer_record/all": function (req, res) {
    res.send({
      state: 1,
      data: Mock.mock({
        count: 101,
        [`items|${10}`]: [
          {
            "id|+1": 100,
            name: "@ctitle(5, 10)",
            "type|1": req.body.type ? [req.body.type] : [1, 2, 3],
            account_id: "@word(32)",
            created_at: '@datetime("y-MM-dd HH:mm:ss")',
            user_name: "@cname()",
            "state|1": [1, 2, 3],
            key: "@word(32)",
            "is_contain_resource|1": [0, 1],
          },
        ],
      }),
    });
  },
  "POST /main.php/json/transfer_record/addSignInfo": function (req, res) {
    res.send({
      state: 1,
      data: "did:dsfgsgsfddfgsg",
    });
  },
  "POST /main.php/json/transfer_record/addAlienation": function (req, res) {
    res.send({
      state: 1,
      data: "did:dsfgsgsfgefrsg",
    });
  },
  "POST /main.php/json/transfer_record/addReceiveInfo": function (req, res) {
    res.send({
      state: 1,
      data: "did:dsagsdfgsgdsgs",
    });
  },
  "POST /main.php/json/transfer_record/getProtocol": function (req, res) {
    res.send({
      state: 1,
      data: receiveProtocol,
      // data: transferProtocol,
    });
  },
  "POST /main.php/json/role/getRoles": function (req, res) {
    res.send({
      state: 1,
      data: Mock.mock({
        count: 100,
        items: [
          {
            id: "qazwsx1",
            name: "项目创建者",
          },
          {
            id: "qazwsx2",
            name: "项目负责人",
          },
          {
            id: "qazwsx3",
            name: "项目参与者",
          },
        ],
      }),
    });
  },
};
