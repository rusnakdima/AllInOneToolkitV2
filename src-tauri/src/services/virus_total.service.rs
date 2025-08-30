/* sys lib */
use tauri_plugin_http::reqwest;

/* models */
use crate::models::response::{DataValue, ResponseModel, ResponseStatus};

pub struct VirusTotalService;

impl VirusTotalService {
  pub fn new() -> Self {
    Self
  }

  #[allow(non_snake_case)]
  pub async fn reqSite(&self, url: String) -> Result<ResponseModel, ResponseModel> {
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
        return Ok(ResponseModel {
          status: ResponseStatus::Success,
          message: "".to_string(),
          data: DataValue::String(json),
        });
      }
      Err(err) => {
        return Err(ResponseModel {
          status: ResponseStatus::Error,
          message: format!("Error fetching data: {}", err),
          data: DataValue::String("".to_string()),
        })
      }
    }
  }
}
