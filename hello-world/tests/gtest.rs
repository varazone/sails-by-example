use sails_rs::{
    calls::*,
    gtest::{System, calls::*},
};

use hello_world_client::traits::*;

const ACTOR_ID: u64 = 42;

#[tokio::test]
async fn say_hello_works() {
    let system = System::new();
    system.init_logger();
    system.mint_to(ACTOR_ID, 100_000_000_000_000);

    let remoting = GTestRemoting::new(system, ACTOR_ID.into());
    remoting.system().init_logger();

    // Submit program code into the system
    let program_code_id = remoting.system().submit_code(hello_world::WASM_BINARY);

    let program_factory = hello_world_client::HelloWorldFactory::new(remoting.clone());

    let program_id = program_factory
        .default() // Call program's constructor (see app/src/lib.rs:29)
        .send_recv(program_code_id, b"salt")
        .await
        .unwrap();

    let mut service_client = hello_world_client::HelloWorld::new(remoting.clone());

    let result = service_client
        .say_hello() // Call service's method (see app/src/lib.rs:14)
        .send_recv(program_id)
        .await
        .unwrap();

    assert_eq!(result, "Hello!".to_string());
}

#[tokio::test]
async fn greet_works() {
    let system = System::new();
    system.init_logger();
    system.mint_to(ACTOR_ID, 100_000_000_000_000);

    let remoting = GTestRemoting::new(system, ACTOR_ID.into());
    remoting.system().init_logger();

    // Submit program code into the system
    let program_code_id = remoting.system().submit_code(hello_world::WASM_BINARY);

    let program_factory = hello_world_client::HelloWorldFactory::new(remoting.clone());

    let program_id = program_factory
        .default() // Call program's constructor (see app/src/lib.rs:29)
        .send_recv(program_code_id, b"salt")
        .await
        .unwrap();

    let service_client = hello_world_client::HelloWorld::new(remoting.clone());

    let result = service_client
        .greet("World".to_string()) // Call service's query (see app/src/lib.rs:19)
        .recv(program_id)
        .await
        .unwrap();

    assert_eq!(result, "Hello, World!".to_string());
}
