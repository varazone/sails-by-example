#![no_std]
use counter_with_event_client::counter;
use counter_with_event_client::traits::Counter;
use sails_rs::gstd::calls::GStdRemoting;
use sails_rs::prelude::*;

pub struct Storage {
    counter: ActorId,
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

#[derive(Encode, Decode, TypeInfo)]
pub enum Event {
    Incremented(i32),
}

#[derive(Default)]
pub struct CounterProxy;

#[service(events = Event)]
impl CounterProxy {
    pub fn init(counter: ActorId) {
        unsafe { STORAGE = Some(Storage { counter }) }
    }

    pub async fn counter(&self) -> ActorId {
        let storage = Storage::get();
        storage.counter
    }

    pub async fn get(&self) -> i32 {
        let storage = Storage::get();
        let counter_id = storage.counter;
        let call_payload = counter::io::Get::encode_call();
        let reply_bytes = sails_rs::gstd::msg::send_bytes_for_reply(counter_id, call_payload, 0, 0)
            .unwrap()
            .await
            .unwrap();
        let reply =
            <counter::io::Get as sails_rs::calls::ActionIo>::decode_reply(&reply_bytes).unwrap();
        reply
    }

    pub async fn get_remoting(&self) -> i32 {
        use sails_rs::calls::Query;
        let storage = Storage::get();
        let counter_id = storage.counter;
        let remoting = counter_with_event_client::Counter::new(GStdRemoting);
        remoting.get().recv(counter_id).await.unwrap()
    }

    pub async fn inc(&mut self) -> i32 {
        let storage = Storage::get();
        let counter_id = storage.counter;
        let call_payload = counter::io::Inc::encode_call();
        let reply_bytes = sails_rs::gstd::msg::send_bytes_for_reply(counter_id, call_payload, 0, 0)
            .unwrap()
            .await
            .unwrap();
        let reply =
            <counter::io::Inc as sails_rs::calls::ActionIo>::decode_reply(&reply_bytes).unwrap();
        let _ = self.notify_on(Event::Incremented(reply));
        reply
    }

    pub async fn inc_remoting(&mut self) -> i32 {
        use sails_rs::calls::Call;
        let storage = Storage::get();
        let counter_id = storage.counter;
        let mut remoting = counter_with_event_client::Counter::new(GStdRemoting);
        let reply = remoting.inc().send_recv(counter_id).await.unwrap();
        let _ = self.notify_on(Event::Incremented(reply));
        reply
    }
}

#[derive(Default)]
pub struct CounterWithEventCallerProgram;

#[program]
impl CounterWithEventCallerProgram {
    pub fn new(counter: ActorId) -> Self {
        CounterProxy::init(counter);
        Self
    }

    pub fn counter_proxy(&self) -> CounterProxy {
        CounterProxy::default()
    }
}
