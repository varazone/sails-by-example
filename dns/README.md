# dDNS

Complation artifacts of https://github.com/varazone/dns

- dns.idl
- dns.opt.wasm

Client code generated from IDL by `sails-js generate -n DnsProgram dns.idl`

- lib.ts

Script for deploying the program on testnet

- deploy.ts

```
$ ./deploy.ts dns.idl dns.opt.wasm
programId: 0xd9e06730085547af856a83b0ca837227bbba86b4209895ec96e885cbfab56888
```

Script for inserting random entries into the program as the alice account

- add-new-program.ts

```
$ ./alice-add-new-program.ts
alice: 0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d
NewProgramAdded: {
  name: '0.8952732363818627',
  contract_info: {
    admins: [
      '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d'
    ],
    program_id: '0x686d99ec81d98096e329b2388b357b5b09359fd1081338e6648ca4fbc319d786',
    registration_time: '2024-08-21 21:20'
  }
}
```

Script for inserting random entries into the program as 1/2 multisig of {alice,bob}

- multisig-add-new-program.ts

```
$ ./multisig-add-new-program.ts
aliceBobMultiAddress: 0x4c5901223c7c52585646634e70dd46ad3faf1270f84a4673b5b4a4e126474073
NewProgramAdded: {
  name: '0.5701288621748675',
  contract_info: {
    admins: [
      '0x4c5901223c7c52585646634e70dd46ad3faf1270f84a4673b5b4a4e126474073'
    ],
    program_id: '0x81b6f894b9384bc2b3916f43e367abd93753e048f5753614a0ec3bff69beaa11',
    registration_time: '2024-08-21 21:21'
  }
}
```
