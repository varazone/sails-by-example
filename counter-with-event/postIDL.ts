import { GearApi } from "@gear-js/api";

export async function postIDL(
  params: {
    api: GearApi;
    codeId: string;
    programId: string;
    idl: string;
    name: string;
  },
) {
  let params2 = await makePostMetadataPayload(params);
  let resp = await postSailsIDL(params2);
  return resp;
}

export async function makePostMetadataPayload(
  params: {
    api: GearApi;
    codeId: string;
    programId: string;
    name: string;
    idl: string;
  },
) {
  let {
    api,
    codeId,
    programId,
    name,
    idl,
  } = params;
  for (let i = 0; i < 10; i++) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    // assert program exists
    if (await api.code.exists(codeId)) {
      break;
    }
  }

  let genesis = api.genesisHash.toHex();
  let params2 = {
    genesis,
    codeId,
    programId,
    name,
    idl,
  };
  return params2;
}

export async function postSailsIDL(
  params: {
    name: string;
    genesis: string;
    codeId: string;
    programId: string;
    idl: string;
  },
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
