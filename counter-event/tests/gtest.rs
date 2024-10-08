use sails_rs::{
    calls::*,
    gtest::{calls::*, System},
};

use counter_event_client::traits::*;

const ACTOR_ID: u64 = 42;

#[tokio::test]
async fn inc_works() {
    let system = System::new();
    system.init_logger();
    system.mint_to(ACTOR_ID, 100_000_000_000_000);

    let remoting = GTestRemoting::new(system, ACTOR_ID.into());
    remoting.system().init_logger();

    // Submit program code into the system
    let program_code_id = remoting.system().submit_code(counter_event::WASM_BINARY);

    let program_factory = counter_event_client::CounterEventFactory::new(remoting.clone());

    let program_id = program_factory
        .new() // Call program's constructor (see app/src/lib.rs:29)
        .send_recv(program_code_id, b"salt")
        .await
        .unwrap();

    let mut service_client = counter_event_client::Counter::new(remoting.clone());

    let result = service_client
        .inc() // Call service's method (see app/src/lib.rs:14)
        .send_recv(program_id)
        .await
        .unwrap();

    assert_eq!(result, 1);
}

#[tokio::test]
async fn get_works() {
    let system = System::new();
    system.init_logger();
    system.mint_to(ACTOR_ID, 100_000_000_000_000);

    let remoting = GTestRemoting::new(system, ACTOR_ID.into());
    remoting.system().init_logger();

    // Submit program code into the system
    let program_code_id = remoting.system().submit_code(counter_event::WASM_BINARY);

    let program_factory = counter_event_client::CounterEventFactory::new(remoting.clone());

    let program_id = program_factory
        .new() // Call program's constructor (see app/src/lib.rs:29)
        .send_recv(program_code_id, b"salt")
        .await
        .unwrap();

    let service_client = counter_event_client::Counter::new(remoting.clone());

    let result = service_client
        .get() // Call service's query (see app/src/lib.rs:19)
        .recv(program_id)
        .await
        .unwrap();

    assert_eq!(result, 0);
}
