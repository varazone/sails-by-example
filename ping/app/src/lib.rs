#![no_std]
#![allow(clippy::new_without_default)]

use sails_rs::prelude::*;
use services::ping;

mod services;

pub struct Program;

#[program]
impl Program {
    pub fn new() -> Self {
        // <ping::Service>::seed(name, symbol, decimals);
        Self
    }

    pub fn ping(&self) -> ping::Service {
        ping::Service::new()
    }
}
