enum GasMethod {
  Reply = "reply",
  Handle = "handle",
  InitCreate = "initCreate",
  InitUpdate = "initUpdate",
}

enum TransactionName {
  SendReply = "gear.sendReply",
  SendMessage = "gear.sendMessage",
  ClaimMessage = "gear.claimValueFromMailbox",
  SubmitCode = "gear.submitCode",
  CreateProgram = "gear.createProgram",
  UploadProgram = "gear.uploadProgram",
}

export { GasMethod, TransactionName };
