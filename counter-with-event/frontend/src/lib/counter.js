export const PROGRAM_ID =
  "0xdf51c3de695524bac0580d7cd5c90fcf248e04443a0a38f541e98b3f9167ca1e";

export const IDL = `
constructor {
  New : ();
};

service Counter {
  Inc : () -> i32;
  query Get : () -> i32;

  events {
    Incremented: i32;
  }
};
`;
