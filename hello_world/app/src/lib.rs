#![no_std]
use sails_rs::prelude::*;

#[derive(Default)]
pub struct Program;

#[program]
impl Program {
    pub fn new() -> Self {
        Self
    }
    pub fn hello_world(&self) -> HelloWorld {
        HelloWorld::default()
    }
}

#[derive(Default)]
pub struct HelloWorld(());

#[service]
impl HelloWorld {
    pub fn hello_world(&mut self) -> &'static str {
        "Hello, world!"
    }
}
