#![no_std]
#![allow(clippy::new_without_default)]

use sails_rs::prelude::*;
use vft_service::Service as VftService;

pub struct Program(());

#[program]
impl Program {
    pub fn new(name: String, symbol: String, decimals: u8) -> Self {
        <VftService>::seed(name, symbol, decimals);
        Self(())
    }

    pub fn vft(&self) -> VftService {
        VftService::new()
    }
}
