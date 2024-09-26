// Code generated by sails-client-gen. DO NOT EDIT.
#[allow(unused_imports)]
use sails_rs::collections::BTreeMap;
#[allow(unused_imports)]
use sails_rs::{
    calls::{Activation, Call, Query, Remoting, RemotingAction},
    prelude::*,
    String,
};
pub struct CounterWithEventFactory<R> {
    #[allow(dead_code)]
    remoting: R,
}
impl<R> CounterWithEventFactory<R> {
    #[allow(unused)]
    pub fn new(remoting: R) -> Self {
        Self { remoting }
    }
}
impl<R: Remoting + Clone> traits::CounterWithEventFactory for CounterWithEventFactory<R> {
    type Args = R::Args;
    fn new(&self) -> impl Activation<Args = R::Args> {
        RemotingAction::<_, counter_with_event_factory::io::New>::new(self.remoting.clone(), ())
    }
}

pub mod counter_with_event_factory {
    use super::*;
    pub mod io {
        use super::*;
        use sails_rs::calls::ActionIo;
        pub struct New(());
        impl New {
            #[allow(dead_code)]
            pub fn encode_call() -> Vec<u8> {
                <New as ActionIo>::encode_call(&())
            }
        }
        impl ActionIo for New {
            const ROUTE: &'static [u8] = &[12, 78, 101, 119];
            type Params = ();
            type Reply = ();
        }
    }
}
pub struct Counter<R> {
    remoting: R,
}
impl<R> Counter<R> {
    pub fn new(remoting: R) -> Self {
        Self { remoting }
    }
}
impl<R: Remoting + Clone> traits::Counter for Counter<R> {
    type Args = R::Args;
    fn inc(&mut self) -> impl Call<Output = i32, Args = R::Args> {
        RemotingAction::<_, counter::io::Inc>::new(self.remoting.clone(), ())
    }
    fn get(&self) -> impl Query<Output = i32, Args = R::Args> {
        RemotingAction::<_, counter::io::Get>::new(self.remoting.clone(), ())
    }
}

pub mod counter {
    use super::*;

    pub mod io {
        use super::*;
        use sails_rs::calls::ActionIo;
        pub struct Inc(());
        impl Inc {
            #[allow(dead_code)]
            pub fn encode_call() -> Vec<u8> {
                <Inc as ActionIo>::encode_call(&())
            }
        }
        impl ActionIo for Inc {
            const ROUTE: &'static [u8] = &[28, 67, 111, 117, 110, 116, 101, 114, 12, 73, 110, 99];
            type Params = ();
            type Reply = i32;
        }
        pub struct Get(());
        impl Get {
            #[allow(dead_code)]
            pub fn encode_call() -> Vec<u8> {
                <Get as ActionIo>::encode_call(&())
            }
        }
        impl ActionIo for Get {
            const ROUTE: &'static [u8] = &[28, 67, 111, 117, 110, 116, 101, 114, 12, 71, 101, 116];
            type Params = ();
            type Reply = i32;
        }
    }

    #[allow(dead_code)]
    #[cfg(not(target_arch = "wasm32"))]
    pub mod events {
        use super::*;
        use sails_rs::events::*;
        #[derive(PartialEq, Debug, Encode, Decode)]
        #[codec(crate = sails_rs::scale_codec)]
        pub enum CounterEvents {
            Incremented(i32),
        }
        impl EventIo for CounterEvents {
            const ROUTE: &'static [u8] = &[28, 67, 111, 117, 110, 116, 101, 114];
            const EVENT_NAMES: &'static [&'static [u8]] =
                &[&[44, 73, 110, 99, 114, 101, 109, 101, 110, 116, 101, 100]];
            type Event = Self;
        }
        pub fn listener<R: Listener<Vec<u8>>>(remoting: R) -> impl Listener<CounterEvents> {
            RemotingListener::<_, CounterEvents>::new(remoting)
        }
    }
}

pub mod traits {
    use super::*;
    #[allow(dead_code)]
    pub trait CounterWithEventFactory {
        type Args;
        #[allow(clippy::new_ret_no_self)]
        #[allow(clippy::wrong_self_convention)]
        fn new(&self) -> impl Activation<Args = Self::Args>;
    }

    #[allow(clippy::type_complexity)]
    pub trait Counter {
        type Args;
        fn inc(&mut self) -> impl Call<Output = i32, Args = Self::Args>;
        fn get(&self) -> impl Query<Output = i32, Args = Self::Args>;
    }
}

#[cfg(feature = "with_mocks")]
#[cfg(not(target_arch = "wasm32"))]
extern crate std;

#[cfg(feature = "with_mocks")]
#[cfg(not(target_arch = "wasm32"))]
pub mod mockall {
    use super::*;
    use sails_rs::mockall::*;
    mock! { pub Counter<A> {} #[allow(refining_impl_trait)] #[allow(clippy::type_complexity)] impl<A> traits::Counter for Counter<A> { type Args = A; fn inc (&mut self, ) -> MockCall<A, i32>;fn get (& self, ) -> MockQuery<A, i32>; } }
}
