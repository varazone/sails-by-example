#![no_std]
use counter::Counter as CounterService;
use hello::HelloWorld as HelloService;
use sails_rs::prelude::*;

mod counter;
mod hello;

#[derive(Default)]
pub struct ExtendedService {
    hello: HelloService,
    counter: CounterService,
}

impl ExtendedService {
    pub fn init() {
        CounterService::init();
    }
}

impl From<ExtendedService> for (HelloService, CounterService) {
    fn from(exts: ExtendedService) -> Self {
        (exts.hello, exts.counter)
    }
}

#[service(extends = [HelloService, CounterService])]
impl ExtendedService {
    #[export]
    pub fn say_hello(&mut self) -> &'static str {
        "你好!"
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
