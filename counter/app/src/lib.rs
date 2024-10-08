#![no_std]
use sails_rs::prelude::*;

pub struct Storage {
    counter: i32,
}

static mut STORAGE: Option<Storage> = None;

impl Storage {
    pub fn get() -> &'static Self {
        unsafe { STORAGE.as_ref().expect("Storage is not initialized") }
    }
    pub fn get_mut() -> &'static mut Self {
        unsafe { STORAGE.as_mut().expect("Storage is not initialized") }
    }
}

#[derive(Default)]
pub struct Counter;

#[service]
impl Counter {
    pub fn init() {
        unsafe { STORAGE = Some(Storage { counter: 0 }) }
    }

    pub fn get(&self) -> i32 {
        let storage = Storage::get();
        storage.counter
    }

    pub fn inc(&mut self) {
        let storage = Storage::get_mut();
        storage.counter += 1;
    }
}

#[derive(Default)]
pub struct CounterProgram;

#[program]
impl CounterProgram {
    pub fn new() -> Self {
        Counter::init();
        Self
    }

    pub fn counter(&self) -> Counter {
        Counter::default()
    }
}
