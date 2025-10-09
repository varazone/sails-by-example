#![no_std]

use sails_rs::gstd::exec::program_id;
use sails_rs::prelude::*;
use ss58;
use bs58;

struct Bs58Service(());

impl Bs58Service {
    pub fn new() -> Self {
        Self(())
    }
}

#[sails_rs::service]
impl Bs58Service {
    /// convert base58 string to bytes
    #[export]
    pub fn decode(&self, ss58_address: String) -> Vec<u8> {
        bs58::decode(&ss58_address).into_vec().unwrap()
    }

    /// convert bytes to base58 string
    #[export]
    pub fn encode(&self, bytes: Vec<u8>) -> String {
        bs58::encode(bytes).into_string()
    }
}

struct Solvara(());

impl Solvara {
    pub fn new() -> Self {
        Self(())
    }
}

#[sails_rs::service]
impl Solvara {
    /// convert Solana base58 address to Vara SS58 address
    #[export]
    pub fn solana_to_vara(&self, solana_address: String) -> String {
        let bytes = bs58::decode(&solana_address).into_vec().unwrap();
        // Convert Vec<u8> to [u8; 32] for ss58 encoding
        let mut array = [0u8; 32];
        array.copy_from_slice(&bytes[..32]);
        ss58::encode(&array, ss58::Ss58AddressFormat::Vara)
    }

    /// convert Vara SS58 address to Solana base58 address
    #[export]
    pub fn vara_to_solana(&self, vara_address: String) -> String {
        let actor_id: ActorId = ss58::decode(&vara_address).into();
        let bytes = actor_id.into_bytes();
        bs58::encode(bytes).into_string()
    }
}

struct Ss58Service(());

impl Ss58Service {
    pub fn new() -> Self {
        Self(())
    }
}

#[sails_rs::service]
impl Ss58Service {
    /// convert ss58 address to ActorId
    #[export]
    pub fn ss58_to_actor_id(&self, ss58_address: String) -> ActorId {
        ss58::decode(&ss58_address).into()
    }

    /// convert ActorId to ss58 address
    #[export]
    pub fn actor_id_to_ss58(&self, actor_id: ActorId, format: ss58::Ss58AddressFormat) -> String {
        ss58::encode(&actor_id.into_bytes(), format)
    }

    /// get own ss58 address
    #[export]
    pub fn my_ss58_address(&self) -> String {
        self.actor_id_to_ss58(program_id(), ss58::Ss58AddressFormat::Vara)
    }
}

pub struct Ss58Program(());

#[sails_rs::program]
impl Ss58Program {
    // Program's constructor
    pub fn new() -> Self {
        Self(())
    }

    // Expose solvara service
    pub fn solvara(&self) -> Solvara {
        Solvara::new()
    }

    // Expose ss58 service
    pub fn ss58(&self) -> Ss58Service {
        Ss58Service::new()
    }

    // Expose bs58 service
    pub fn bs58(&self) -> Bs58Service {
        Bs58Service::new()
    }
}
