export const PROGRAM_ID =
  "0x2352836c6d8566a39de202052031079e5974f51ddf66c8cec34e819a5af7f3e0";

export const IDL = `
type ContractInfo = struct {
  admins: vec actor_id,
  program_id: actor_id,
  registration_time: str,
};

constructor {
  New : ();
};

service Dns {
  AddAdminToProgram : (name: str, new_admin: actor_id) -> null;
  AddNewProgram : (name: str, program_id: actor_id) -> null;
  ChangeProgramId : (name: str, new_program_id: actor_id) -> null;
  DeleteMe : () -> null;
  DeleteProgram : (name: str) -> null;
  RemoveAdminFromProgram : (name: str, admin_to_remove: actor_id) -> null;
  query AllContracts : () -> vec struct { str, ContractInfo };
  query GetAllAddresses : () -> vec actor_id;
  query GetAllNames : () -> vec str;
  query GetContractInfoByName : (name: str) -> opt ContractInfo;
  query GetNameByProgramId : (program_id: actor_id) -> opt str;

  events {
    NewProgramAdded: struct { name: str, contract_info: ContractInfo };
    ProgramIdChanged: struct { name: str, contract_info: ContractInfo };
    ProgramDeleted: struct { name: str };
    AdminAdded: struct { name: str, contract_info: ContractInfo };
    AdminRemoved: struct { name: str, contract_info: ContractInfo };
  }
};
`;
