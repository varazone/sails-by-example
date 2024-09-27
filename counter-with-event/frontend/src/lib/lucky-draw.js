export const PROGRAM_ID =
  "0x62cd1abd9e69b17a7e438147badd19a8152f44d75914e5c2fd32c2001bd65973";

export const IDL = `
type GameState = struct {
  admin: actor_id,
  players: vec actor_id,
  config: opt Config,
  winners: vec struct { actor_id, u128 },
  status: Status,
};

type Config = struct {
  per_share: u128,
  max_share: u32,
};

type Status = enum {
  Idle,
  OnGoing,
  Completed,
};

constructor {
  New : ();
};

service LuckyDraw {
  Claim : () -> null;
  Draw : () -> null;
  StartGame : (per_share: u128, max_share: u32) -> null;
  Terminate : () -> null;
  query GameState : () -> GameState;

  events {
    Started: struct { config: Config };
    Deposited: struct { who: actor_id, index: u32, target: u32 };
    Completed;
  }
};
`;
