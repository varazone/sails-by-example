import { GearApi } from "@gear-js/api";

export async function postIDL(
  {
    api: GearApi,
    codeId: string,
    programId: string,
    sailsIDL: string,
    name: string,
  },
) {
  let params = await makePostMetadataPayload({
    api,
    codeId,
    programId,
    name,
    sailsIDL,
  });
  let resp = await postSailsIDL(params);
  return resp;
}

export async function makePostMetadataPayload(
  {
    api: GearApi,
    codeId: string,
    programId: string,
    name: string,
    sailsIDL: string,
  },
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
    sailsIDL,
  };
  return params;
}

export async function postSailsIDL(
  params: {
    name: string;
    genesis: string;
    codeId: string;
    programId: string;
    sailsIDL: string;
  },
) {
  let {
    name,
    genesis,
    codeId,
    programId,
    sailsIDL,
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
        data: sailsIDL,
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
