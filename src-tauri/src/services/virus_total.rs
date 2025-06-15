/* sys lib */
use tauri_plugin_http::reqwest;

/* models */
use crate::models::response::{DataValue, Response};

pub async fn req_site(url: String) -> Response {
  let client = reqwest::Client::new();
  let response = client
    .get(url)
    .header(
      "x-apikey",
      "7a8e8b508ecbba8020e949da7d4edb85d64c55429d04593884c2cececad685d1",
    )
    .send()
    .await;

  match response {
    Ok(res) => {
      let json = res.text().await.unwrap();
      return Response {
        status: "success".to_string(),
        message: "".to_string(),
        data: DataValue::String(json),
      };
    }
    Err(err) => {
      return Response {
        status: "error".to_string(),
        message: format!("Error fetching data: {}", err),
        data: DataValue::String("".to_string()),
      }
    }
  }
}
