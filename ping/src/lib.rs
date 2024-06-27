#![no_std]

use gstd::debug;
use sails_rtl::{gstd::gservice, prelude::*};

struct MyPing;

#[gservice]
impl MyPing {
    pub const fn new() -> Self {
        Self
    }

    pub async fn ping(&mut self) -> bool {
        debug!("Ping called");
        true
    }
}

#[derive(Default)]
struct MyProgram;

#[gprogram]
impl MyProgram {
    #[groute("ping")]
    pub fn ping_svc(&self) -> MyPing {
        MyPing::new()
    }
}
