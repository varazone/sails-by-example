declare global {
  /**
   * Enum for address versions — you can expand this as needed
  */
  export type Ss58AddressFormat = 
    /**
     * 0
    */
    | { Polkadot: null }
    /**
     * 2
    */
    | { Kusama: null }
    /**
     * 42
    */
    | { Substrate: null }
    /**
     * 137
    */
    | { Vara: null }
    /**
     * custom
    */
    | { Custom: number };
};