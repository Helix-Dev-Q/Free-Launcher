export class RuntimeInit {
  public status: "pending" | "valid" | "invalid" = "pending";

  async init(): Promise<"valid" | "invalid"> {
    this.status = "valid";
    return "valid";
  }
}
