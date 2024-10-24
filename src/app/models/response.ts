export class Response {
  constructor(
    public status: "success" | "warning" | "error",
    public message: string,
    public data: any
  ) {}

  public static fromJson(json: any, isParseData: boolean = false): Response {
    if (isParseData) {
      try {
        return new Response(json.status, json.message, JSON.parse(json.data));
      } catch (e) {
        console.error("Failed to parse JSON data:", json.data);
        return new Response(json.status, json.message, json.data);
      }
    }
    return new Response(json.status, json.message, json.data);
  }
}
