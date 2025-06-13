export const PROGRAM_ID =
  "0xdf51c3de695524bac0580d7cd5c90fcf248e04443a0a38f541e98b3f9167ca1e";

export const IDL = `
constructor {
  /// set initial value
  New : (initial_value: i32);
};

service Counter {
  /// increment counter by 1
  Inc : () -> i32;
  /// get counter value
  query Get : () -> i32;

  events {
    /// counter incremented to value
    IncrementedTo: i32;
  }
};
`;
