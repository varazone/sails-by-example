use sails_rs::prelude::*;

#[derive(Clone, Default)]
pub struct Storage {
    counter: u32,
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

#[derive(Clone, Default)]
pub struct Counter;

#[service]
impl Counter {
    pub fn init() {
        unsafe { STORAGE = Some(Storage::default()) }
    }

    pub fn get(&self) -> u32 {
        let storage = Storage::get();
        storage.counter
    }

    pub fn inc(&mut self) {
        let storage = Storage::get_mut();
        storage.counter += 1;
    }
}
