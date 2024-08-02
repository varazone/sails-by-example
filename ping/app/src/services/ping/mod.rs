use gstd::{debug, format, Decode, Encode, String, Vec};
use sails_rs::prelude::*;

pub struct Service;

#[service]
impl Service {
    pub const fn new() -> Self {
        Self
    }

    pub async fn ping(&mut self) -> bool {
        debug!("Ping called");
        true
    }
}
