use sails_rs::{
    calls::*,
    gtest::{System, calls::*},
};

use ping_client::traits::*;

const ACTOR_ID: u64 = 42;

#[tokio::test]
async fn ping_works() {
    let system = System::new();
    system.init_logger();
    system.mint_to(ACTOR_ID, 100_000_000_000_000);

    let remoting = GTestRemoting::new(system, ACTOR_ID.into());
    remoting.system().init_logger();

    // Submit program code into the system
    let program_code_id = remoting.system().submit_code(ping::WASM_BINARY);

    let program_factory = ping_client::PingFactory::new(remoting.clone());

    let program_id = program_factory
        .new() // Call program's constructor (see app/src/lib.rs:29)
        .send_recv(program_code_id, b"salt")
        .await
        .unwrap();

    let mut service_client = ping_client::Ping::new(remoting.clone());

    let result = service_client
        .ping() // Call service's method (see app/src/lib.rs:14)
        .send_recv(program_id)
        .await
        .unwrap();

    assert_eq!(result, true);
}

#[tokio::test]
async fn get_something_works() {
    let system = System::new();
    system.init_logger();
    system.mint_to(ACTOR_ID, 100_000_000_000_000);

    let remoting = GTestRemoting::new(system, ACTOR_ID.into());
    remoting.system().init_logger();

    // Submit program code into the system
    let program_code_id = remoting.system().submit_code(ping::WASM_BINARY);

    let program_factory = ping_client::PingFactory::new(remoting.clone());

    let program_id = program_factory
        .new() // Call program's constructor (see app/src/lib.rs:29)
        .send_recv(program_code_id, b"salt")
        .await
        .unwrap();

    let service_client = ping_client::Ping::new(remoting.clone());

    let result = service_client
        .get_something() // Call service's query (see app/src/lib.rs:19)
        .recv(program_id)
        .await
        .unwrap();

    assert_eq!(result, "Hello from Ping!".to_string());
}
