declare global {
  /**
   * Enum for address versions — you can expand this as needed
   */
  export type Ss58AddressFormat =
    | { polkadot: null }
    | { kusama: null }
    | { vara: null }
    | { custom: number };
}
