export const PROGRAM_ID =
  "0x761ed1caaadbbca717bd5ad77c997ec15d3db41b9e059004373f2d4ce7917289";

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
