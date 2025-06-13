#![no_std]

use sails_rs::gstd::exec::program_id;
use sails_rs::prelude::*;

mod ss58;
use ss58::{Ss58AddressFormat, decode, encode};

struct Ss58Service(());

#[sails_rs::service]
impl Ss58Service {
    pub fn new() -> Self {
        Self(())
    }

    /// convert ss58 address to ActorId
    pub fn ss58_to_actor_id(&self, ss58_address: String) -> ActorId {
        decode(&ss58_address).into()
    }

    /// convert ActorId to ss58 address
    pub fn actor_id_to_ss58(&self, actor_id: ActorId, format: Ss58AddressFormat) -> String {
        encode(&actor_id.into_bytes(), format)
    }

    /// get own ss58 address
    pub fn my_ss58_address(&self) -> String {
        self.actor_id_to_ss58(program_id(), Ss58AddressFormat::Vara)
    }
}

pub struct Ss58Program(());

#[sails_rs::program]
impl Ss58Program {
    // Program's constructor
    pub fn new() -> Self {
        Self(())
    }

    // Exposed service
    pub fn ss58(&self) -> Ss58Service {
        Ss58Service::new()
    }
}
