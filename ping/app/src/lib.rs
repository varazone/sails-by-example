#![no_std]
#![allow(clippy::new_without_default)]

use sails_rtl::gstd::gprogram;
use services::ping;

mod services;

pub struct Program;

#[gprogram]
impl Program {
    pub fn new() -> Self {
        // <ping::Service>::seed(name, symbol, decimals);
        Self
    }

    pub fn ping(&self) -> ping::Service {
        ping::Service::new()
    }
}
