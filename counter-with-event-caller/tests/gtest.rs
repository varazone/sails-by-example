/// TODO: test fixtures
/// https://github.com/gear-tech/sails/blob/96715d087c0849977bf01ea05d6c22899aec7c5a/examples/rmrk/resource/wasm/tests/resources.rs
/// https://github.com/gear-tech/sails/blob/master/examples/demo/app/tests/fixture/mod.rs
use sails_rs::{
    calls::*,
    gtest::{System, calls::*},
};

use counter_with_event_caller_client::traits::*;

const ACTOR_ID: u64 = 42;

struct Fixture {
    program_space: GTestRemoting,
    counter_id: ActorId,
    proxy_id: ActorId,
}

impl Fixture {
    fn new() -> Self {
        let system = System::new();
        system.init_logger();
        system.mint_to(ACTOR_ID, 100_000_000_000_000);

        let counter_id = Self::create_counter_program(&system);
        let proxy_id = Self::create_proxy_program(&system, counter_id);

        let program_space = GTestRemoting::new(system, ACTOR_ID.into());

        Self {
            program_space,
            counter_id,
            proxy_id,
        }
    }

    fn create_counter_program(system: &System) -> ActorId {
        let resource_program = Program::from_file(system, RESOURCE_PROGRAM_WASM_PATH);
        resource_program.send_bytes(ADMIN_ID, resources::CTOR_FUNC_NAME.encode());
        resource_program.id()
    }
}

/*
#[tokio::test]
async fn do_something_works() {
    let system = System::new();
    system.init_logger();
    system.mint_to(ACTOR_ID, 100_000_000_000_000);

    let remoting = GTestRemoting::new(system, ACTOR_ID.into());
    remoting.system().init_logger();

    // Submit program code into the system
    let program_code_id = remoting
        .system()
        .submit_code(counter_with_event_caller::WASM_BINARY);

    let program_factory =
        counter_with_event_caller_client::CounterWithEventCallerFactory::new(remoting.clone());

    let program_id = program_factory
        .new() // Call program's constructor (see app/src/lib.rs:29)
        .send_recv(program_code_id, b"salt")
        .await
        .unwrap();

    let mut service_client =
        counter_with_event_caller_client::CounterProxy::new(remoting.clone());

    let result = service_client
        .do_something() // Call service's method (see app/src/lib.rs:14)
        .send_recv(program_id)
        .await
        .unwrap();

    assert_eq!(result, "Hello from CounterWithEventCaller!".to_string());
}

#[tokio::test]
async fn get_something_works() {
    let system = System::new();
    system.init_logger();
    system.mint_to(ACTOR_ID, 100_000_000_000_000);

    let remoting = GTestRemoting::new(system, ACTOR_ID.into());
    remoting.system().init_logger();

    // Submit program code into the system
    let program_code_id = remoting
        .system()
        .submit_code(counter_with_event_caller::WASM_BINARY);

    let program_factory =
        counter_with_event_caller_client::CounterWithEventCallerFactory::new(remoting.clone());

    let program_id = program_factory
        .new() // Call program's constructor (see app/src/lib.rs:29)
        .send_recv(program_code_id, b"salt")
        .await
        .unwrap();

    let service_client =
        counter_with_event_caller_client::CounterProxy::new(remoting.clone());

    let result = service_client
        .get_something() // Call service's query (see app/src/lib.rs:19)
        .recv(program_id)
        .await
        .unwrap();

    assert_eq!(result, "Hello from CounterWithEventCaller!".to_string());
}
*/
