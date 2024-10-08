#![no_std]
#![allow(clippy::new_without_default)]

use sails_rs::prelude::*;
use services::vft;

mod services;

pub struct Program(());

#[program]
impl Program {
    pub fn new(name: String, symbol: String, decimals: u8) -> Self {
        <vft::Service>::seed(name, symbol, decimals);
        Self(())
    }

    pub fn vft(&self) -> vft::Service {
        vft::Service::new()
    }
}
