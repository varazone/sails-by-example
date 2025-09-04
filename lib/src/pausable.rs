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

impl Pausable {
    pub fn init() {
        unsafe { STORAGE = Some(Default::default()) }
    }
}

#[service]
impl Pausable {
    #[export]
    pub fn paused(&self) -> bool {
        let storage = Storage::get();
        storage.paused
    }

    #[export]
    pub fn pause(&mut self) {
        self._pause()
    }

    #[export]
    pub fn unpause(&mut self) {
        self._unpause()
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

    pub fn _pause(&mut self) {
        let storage = Storage::get_mut();
        storage.paused = true;
    }

    pub fn _unpause(&mut self) {
        let storage = Storage::get_mut();
        storage.paused = false;
    }
}
