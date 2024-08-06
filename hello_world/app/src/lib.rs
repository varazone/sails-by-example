#![no_std]
use sails_rs::prelude::*;

#[derive(Default)]
pub struct HelloWorld;

#[service]
impl HelloWorld {
    pub fn say_hello(&mut self) -> &'static str {
        "Hello!"
    }

    pub fn greet(&mut self, name: String) -> String {
        format!("Hello, {name}!")
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
