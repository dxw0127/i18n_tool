const qs = require("./qs.js");

async function request(pendI18nWords, targetLanguage) {
  console.log("11111111111111111111111:", pendI18nWords);

  // console.log("request ---> data:", data);

  const fetchRes = async (word) => {
    const data = qs.stringify({
      msg: [word],
      is_camelize: 0,
      // type?: 'ZH_CN2EN' | 'EN2ZH_CN';
      is_pinyin: 0,
    });
    const res = await fetch(
      "https://dp-nhu8tgl6b7sfv-8088.gw002.oneitfarm.com/proxy/call/?url=/index.php/Translate/multiSpecial",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "zh-CN",
          authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcm9tX2FwcGlkIjoiMDQzZmMzNjhhZWVlNGYyNzkxY2JmZGIwMWYzOWFiYzMiLCJmcm9tX2FwcGtleSI6InRvcG9iM2t6Z3N0bjdzZ2p5Y251Zm0wanBhYnduYzd6IiwiZnJvbV9jaGFubmVsIjoiMiIsImFwcGlkIjoiMDQzZmMzNjhhZWVlNGYyNzkxY2JmZGIwMWYzOWFiYzMiLCJhcHBrZXkiOiJ0b3BvYjNremdzdG43c2dqeWNudWZtMGpwYWJ3bmM3eiIsImNoYW5uZWwiOiIyIiwiYWxpYXMiOiJkZWZhdWx0IiwiYWNjb3VudF9pZCI6IjIyYzU4NzVmOWNkNWMxZGE4ZWNlZWRmMDFlODg3ZTQ5Iiwic3ViX29yZ19rZXkiOiJzdWJfb3JnX2tleSIsInVzZXJfaW5mbyI6e30sImNhbGxfc3RhY2siOlt7ImFsaWFzIjoiZGVmdWx0IiwiYXBwaWQiOiIwNDNmYzM2OGFlZWU0ZjI3OTFjYmZkYjAxZjM5YWJjMyIsImFwcGtleSI6InRvcG9iM2t6Z3N0bjdzZ2p5Y251Zm0wanBhYnduYzd6IiwiY2hhbm5lbCI6IjIiLCJ2ZXJzaW9uIjoiMC4wLjAifV0sInN1cGVyX2FjY291bnRfaWQiOiJ4eHh4eHgiLCJleHAiOjE3MzQ5NDU0ODYsImlhdCI6MTY0ODU0NTQ4NiwiaXNzIjoiZGFkM2EzN2FhOWQ1MDY4OGI1MTU3Njk4YWNmZDdhZWUiLCJuYmYiOjE2NDg1NDU0ODZ9.-bE2KfnMd5FRBl4PaCNDULKKpHX7Xz31OIwr9_mSPZU",
          "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded",
          pragma: "no-cache",
          requeststack:
            '[{"appid":"043fc368aeee4f2791cbfdb01f39abc3","appkey":"topob3kzgstn7sgjycnufm0jpabwnc7z","channel":"2"}]',
          "sec-ch-ua":
            '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
          Referer: "http://localhost:8081/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: data,

        method: "POST",
      }
    );

    if (res.ok) {
      const json = await res.json();
      // console.log("request ---> json:", json);
      return json.data[0];
    }
    return "";
  };

  const arrRes = await Promise.all(pendI18nWords.map((word) => fetchRes(word)));
  console.log("request ---> arrRes:", arrRes);

  return arrRes;
}

module.exports = request;
