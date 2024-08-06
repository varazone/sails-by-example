#![no_std]
use sails_rs::prelude::*;
use counter::Counter as CounterService;
use hello::HelloWorld as HelloService;

mod counter;
mod hello;

#[derive(Default)]
pub struct ExtendedService {
    hello: HelloService,
    counter: CounterService,
}

#[service(extends = [HelloService, CounterService])]
impl ExtendedService {
    pub fn init() {
        CounterService::init();
    }
    pub fn say_hello(&mut self) -> &'static str {
        "你好!"
    }
}

impl AsRef<HelloService> for ExtendedService {
    fn as_ref(&self) -> &HelloService {
        &self.hello
    }
}

impl AsRef<CounterService> for ExtendedService {
    fn as_ref(&self) -> &CounterService {
        &self.counter
    }
}

#[derive(Default)]
pub struct Program;

#[program]
impl Program {
    pub fn new() -> Self {
        ExtendedService::init();
        Self::default()
    }
    pub fn extended_service(&self) -> ExtendedService {
        ExtendedService::default()
    }
}
