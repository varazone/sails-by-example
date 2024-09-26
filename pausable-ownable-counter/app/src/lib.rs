#![no_std]
use counter::Counter as CounterService;
use lib::ownable::Ownable as OwnableService;
use lib::pausable::Pausable as PausableService;
use sails_rs::prelude::*;

mod counter;

#[derive(Default)]
pub struct ExtendedService {
    counter: CounterService,
    pausable: PausableService,
    ownable: OwnableService,
}

#[service(extends = [PausableService, OwnableService, CounterService])]
impl ExtendedService {
    pub fn init() {
        PausableService::init();
        OwnableService::init();
        CounterService::init();
    }

    pub fn pause(&mut self) {
        self.ownable._only_owner();
        self.pausable.pause();
    }

    pub fn unpause(&mut self) {
        self.ownable._only_owner();
        self.pausable.unpause();
    }
}

impl AsRef<OwnableService> for ExtendedService {
    fn as_ref(&self) -> &OwnableService {
        &self.ownable
    }
}

impl AsRef<PausableService> for ExtendedService {
    fn as_ref(&self) -> &PausableService {
        &self.pausable
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

    #[route("pausable_ownable_counter")]
    pub fn extended_service(&self) -> ExtendedService {
        ExtendedService::default()
    }
}
