import { GearApi } from "@gear-js/api";

export async function postIDL({ api, codeId, programId, idl, name }) {
  let params = await makePostMetadataPayload({
    api,
    codeId,
    programId,
    name,
    idl,
  });
  let resp = await postSailsIDL(params);
  return resp;
}

export async function makePostMetadataPayload(
  { api, codeId, programId, name, idl },
) {
  for (let i = 0; i < 10; i++) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    // assert program exists
    if (await api.code.exists(codeId)) {
      break;
    }
  }

  let genesis = api.genesisHash.toHex();
  let params = {
    genesis,
    codeId,
    programId,
    name,
    idl,
  };
  return params;
}

export async function postSailsIDL(
  params,
) {
  let {
    name,
    genesis,
    codeId,
    programId,
    idl,
  } = params;

  let requests = [
    [
      "https://explorer.gear-tech.io/api",
      {
        "id": Math.floor(Math.random() * 100),
        "jsonrpc": "2.0",
        "method": "code.setMeta",
        "params": {
          genesis,
          metaType: "sails",
          id: codeId,
        },
      },
    ],
    [
      "https://explorer.gear-tech.io/api",
      {
        "id": Math.floor(Math.random() * 100),
        "jsonrpc": "2.0",
        "method": "program.setMeta",
        "params": {
          genesis,
          metaType: "sails",
          name,
          id: programId,
        },
      },
    ],
    [
      "https://meta-storage.gear-tech.io/sails",
      {
        codeId,
        data: idl,
      },
    ],
  ];

  let promises = requests.map(([endpoint, payload]) => {
    return fetch(endpoint, {
      "headers": {
        "Accept": "application/json",
        "content-type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(payload),
      "method": "POST",
    }).then((response) => response.json());
  });

  return await Promise.all(promises);
}
