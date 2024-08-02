#![no_std]
use sails_rs::prelude::*;

#[derive(Default)]
pub struct HelloWorld;

#[service]
impl HelloWorld {
    pub fn greeting(&mut self) -> &'static str {
        "Hello, world!"
    }
}

#[derive(Default)]
pub struct Program;

#[program]
impl Program {
    pub fn hello_world(&self) -> HelloWorld {
        HelloWorld::default()
    }
}
