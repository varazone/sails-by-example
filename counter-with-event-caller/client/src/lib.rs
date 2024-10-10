#![no_std]

// Incorporate code generated based on the IDL file
include!(concat!(env!("OUT_DIR"), "/counter_with_event_caller_client.rs"));
