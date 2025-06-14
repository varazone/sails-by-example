use sails_rs::prelude::*;

#[derive(Default)]
pub struct Storage {
    paused: bool,
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

#[derive(Clone, Default)]
pub struct Pausable;

#[service]
impl Pausable {
    pub fn init() {
        unsafe { STORAGE = Some(Default::default()) }
    }

    pub fn paused(&self) -> bool {
        let storage = Storage::get();
        storage.paused
    }

    pub fn pause(&mut self) {
        let storage = Storage::get_mut();
        storage.paused = true;
    }

    pub fn unpause(&mut self) {
        let storage = Storage::get_mut();
        storage.paused = false;
    }
}

impl Pausable {
    pub fn _when_paused(&self) {
        let storage = Storage::get();
        assert_eq!(storage.paused, true);
    }

    pub fn _when_not_paused(&self) {
        let storage = Storage::get();
        assert_eq!(storage.paused, false);
    }
}
