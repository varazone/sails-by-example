#![no_std]
use counter::Counter;
use lib::ownable::Ownable;
use lib::pausable::Pausable;
use sails_rs::prelude::*;

mod counter;

#[derive(Default)]
pub struct ExtendedService {
    counter: Counter,
    pausable: Pausable,
    ownable: Ownable,
}

impl ExtendedService {
    pub fn init() {
        Pausable::init();
        Ownable::init();
        Counter::init();
    }
}

impl From<ExtendedService> for (Pausable, Ownable, Counter) {
    fn from(exts: ExtendedService) -> Self {
        (exts.pausable, exts.ownable, exts.counter)
    }
}

#[service(extends = [Pausable, Ownable, Counter])]
impl ExtendedService {
    #[export]
    pub fn pause(&mut self) {
        self.ownable._only_owner();
        self.pausable._pause();
    }

    #[export]
    pub fn unpause(&mut self) {
        self.ownable._only_owner();
        self.pausable._unpause();
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

    #[export(route = "pausable_ownable_counter")]
    pub fn extended_service(&self) -> ExtendedService {
        ExtendedService::default()
    }
}
