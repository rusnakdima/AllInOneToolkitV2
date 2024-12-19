export class Response {
  constructor(
    public status: "success" | "warning" | "error",
    public message: string,
    public data: any
  ) {}

  public static fromJson(json: any, isParseData: boolean = false): Response {
    if (isParseData) {
      if (json.data != "") {
        try {
          return new Response(json.status, json.message, JSON.parse(json.data));
        } catch (e) {
          console.error("Failed to parse JSON data:", json.data);
          return new Response(json.status, json.message, json.data);
        }
      } else {
        return new Response("error", "Error to parse JSON data", "");
      }
    }
    return new Response(json.status, json.message, json.data);
  }
}
