use sails_rs::gstd::msg;
use sails_rs::prelude::*;

#[derive(Default)]
pub struct Storage {
    owner: ActorId,
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
pub struct Ownable;

#[service]
impl Ownable {
    pub fn init() {
        unsafe { STORAGE = Some(Default::default()) }
        let mut ownable = Ownable::default();
        ownable._transfer_ownership(msg::source());
    }

    pub fn owner(&self) -> ActorId {
        let storage = Storage::get();
        storage.owner
    }

    pub fn transfer_ownership(&mut self, new_owner: ActorId) {
        self._only_owner();
        if new_owner == ActorId::zero() {
            panic!("cannot transfer to zero address");
        }
        self._transfer_ownership(new_owner);
    }

    pub fn renounce_ownership(&mut self) {
        self._only_owner();
        self._transfer_ownership(ActorId::zero());
    }
}

impl Ownable {
    fn _transfer_ownership(&mut self, new_owner: ActorId) {
        let storage = Storage::get_mut();
        storage.owner = new_owner;
    }

    pub fn _only_owner(&self) {
        let storage = Storage::get();
        assert_eq!(storage.owner, msg::source());
    }
}
