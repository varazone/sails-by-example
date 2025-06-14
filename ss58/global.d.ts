declare global {
  /**
   * Enum for address versions — you can expand this as needed
   */
  export type Ss58AddressFormat =
    /**
     * 0
     */
    | { polkadot: null }
    /**
     * 2
     */
    | { kusama: null }
    /**
     * 42
     */
    | { substrate: null }
    /**
     * 137
     */
    | { vara: null }
    /**
     * custom
     */
    | { custom: number };
}
