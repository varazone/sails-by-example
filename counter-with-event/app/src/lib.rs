#![no_std]
use sails_rs::prelude::*;

pub struct Storage {
    counter: i32,
}

static mut STORAGE: Option<Storage> = None;

impl Storage {
    pub fn get() -> &'static Self {
        #[allow(static_mut_refs)]
        unsafe {
            STORAGE.as_ref().expect("Storage is not initialized")
        }
    }
    pub fn get_mut() -> &'static mut Self {
        #[allow(static_mut_refs)]
        unsafe {
            STORAGE.as_mut().expect("Storage is not initialized")
        }
    }
}

#[derive(Encode, Decode, TypeInfo)]
pub enum Event {
    /// counter incremented to value
    IncrementedTo(i32),
}

#[derive(Default)]
pub struct CounterWithEvent;

#[service(events = Event)]
impl CounterWithEvent {
    pub fn init(initial_value: i32) {
        unsafe {
            STORAGE = Some(Storage {
                counter: initial_value,
            })
        }
    }

    /// get counter value
    pub fn get(&self) -> i32 {
        let storage = Storage::get();
        storage.counter
    }

    /// increment counter by 1
    pub fn inc(&mut self) -> i32 {
        let storage = Storage::get_mut();
        storage.counter += 1;

        let _ = self.emit_event(Event::IncrementedTo(storage.counter));

        storage.counter
    }
}

#[derive(Default)]
pub struct CounterWithEventProgram;

#[program]
impl CounterWithEventProgram {
    /// set initial value
    pub fn new(initial_value: i32) -> Self {
        CounterWithEvent::init(initial_value);
        Self
    }

    pub fn counter(&self) -> CounterWithEvent {
        CounterWithEvent::default()
    }
}
