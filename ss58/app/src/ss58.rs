use blake2::{Blake2b512, Digest};
use bs58;
use sails_rs::prelude::*;

/// Enum for address versions — you can expand this as needed
#[derive(Copy, Clone, Encode, Decode, TypeInfo)]
pub enum Ss58AddressFormat {
    /// 0
    Polkadot,
    /// 2
    Kusama,
    /// 42
    Substrate,
    /// 137
    Vara,
    /// custom
    Custom(u16),
}

impl From<Ss58AddressFormat> for u16 {
    fn from(format: Ss58AddressFormat) -> Self {
        match format {
            Ss58AddressFormat::Polkadot => 0,
            Ss58AddressFormat::Kusama => 2,
            Ss58AddressFormat::Substrate => 42,
            Ss58AddressFormat::Vara => 137,
            Ss58AddressFormat::Custom(v) => v,
        }
    }
}

/// Convert a fixed-length u8 array (public key) to SS58-encoded address
pub fn encode(pubkey: &[u8; 32], version: Ss58AddressFormat) -> String {
    // Encode version prefix (same logic as in your code)
    let ident: u16 = u16::from(version) & 0b0011_1111_1111_1111;
    let mut v = match ident {
        0..=63 => vec![ident as u8],
        64..=16_383 => {
            let first = ((ident & 0b0000_0000_1111_1100) as u8) >> 2;
            let second = ((ident >> 8) as u8) | (((ident & 0b11) as u8) << 6);
            vec![first | 0b0100_0000, second]
        }
        _ => panic!("Invalid SS58 prefix range"),
    };

    v.extend_from_slice(pubkey);

    // Compute the checksum using the provided ss58hash utility
    let hash = ss58hash(&v);
    v.extend_from_slice(&hash[..2]);

    // Base58 encode the result
    bs58::encode(v).into_string()
}

const PREFIX: &[u8] = b"SS58PRE";

fn ss58hash(data: &[u8]) -> Vec<u8> {
    let mut ctx = Blake2b512::new();
    ctx.update(PREFIX);
    ctx.update(data);
    ctx.finalize().to_vec()
}

const BS58_MIN_LEN: usize = 35; // Prefix (1) + ID (32) + Checksum (2)

pub fn decode(address: &str) -> [u8; 32] {
    let decoded = bs58::decode(address).into_vec().expect("get valid base58");
    let len = decoded.len();
    if len < BS58_MIN_LEN {
        panic!("Unable to decode bs58 address");
    }
    let slice: [u8; 32] = decoded[len - 34..len - 2]
        .try_into()
        .expect("get array length of 32");
    slice
}
