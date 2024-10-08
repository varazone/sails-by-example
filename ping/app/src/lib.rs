#![no_std]
#![allow(clippy::new_without_default)]

use gstd::{debug, format, Decode, Encode, String, Vec};
use sails_rs::prelude::*;

pub struct PingService;

#[service]
impl PingService {
    pub fn new() -> Self {
        Self
    }

    pub async fn ping(&mut self) -> bool {
        debug!("Ping called");
        true
    }

    pub fn get_something(&self) -> String {
        "Hello from Ping!".into()
    }
}

pub struct PingProgram;

#[program]
impl PingProgram {
    pub fn new() -> Self {
        Self
    }

    pub fn ping(&self) -> PingService {
        PingService::new()
    }
}