/* sys lib */
use encoding_rs::{ISO_8859_10, UTF_8, WINDOWS_1252};
use reqwest::header::CONTENT_TYPE;
use roxmltree::Document;
use serde_json::Value;
use std::io::{Read, Write};
use std::str::FromStr;
use std::{fs::File, path::Path};
use tauri::http::{HeaderMap, HeaderName};
use tauri::Manager;
use tauri_plugin_http::reqwest;

/* helpers */
use crate::helpers::common::CommonHelper;

/* models */
use crate::models::{
  collection_data::CollectionData,
  request_data::{BodyValue, RequestData, TypeRequest},
  response::{DataValue, ResponseModel, ResponseStatus},
};

#[allow(non_snake_case)]
pub struct UrlRequestsService {
  pub commonHelper: CommonHelper,
  pub homeAppFolder: String,
}

impl UrlRequestsService {
  #[allow(non_snake_case)]
  pub fn new(envValue: String) -> Self {
    Self {
      commonHelper: CommonHelper::new(),
      homeAppFolder: envValue,
    }
  }

  #[allow(non_snake_case)]
  fn tryDecodeBytes(&self, bytes: &[u8]) -> String {
    if let Ok(text) = String::from_utf8(bytes.to_vec()) {
      return text;
    }

    let (decoded, _, hadErrors) = ISO_8859_10.decode(bytes);
    if !hadErrors {
      return decoded.into_owned();
    }

    let (decoded, _, hadErrors) = WINDOWS_1252.decode(bytes);
    if !hadErrors {
      return decoded.into_owned();
    }

    String::from_utf8_lossy(bytes).into_owned()
  }

  #[allow(non_snake_case)]
  fn detectCharsetFromContentType(
    &self,
    contentType: &str,
  ) -> Option<&'static encoding_rs::Encoding> {
    let contentTypeLower = contentType.to_lowercase();

    if contentTypeLower.contains("charset=utf-8") {
      Some(UTF_8)
    } else if contentTypeLower.contains("charset=iso-8859-1") {
      Some(ISO_8859_10)
    } else if contentTypeLower.contains("charset=windows-1252") {
      Some(WINDOWS_1252)
    } else {
      None
    }
  }

  #[allow(non_snake_case)]
  fn decodeWithEncoding(
    &self,
    bytes: &[u8],
    encoding: &'static encoding_rs::Encoding,
  ) -> Result<String, String> {
    let (decoded, _, hadErrors) = encoding.decode(bytes);
    if hadErrors {
      Err(format!(
        "Decoding errors with encoding: {}",
        encoding.name()
      ))
    } else {
      Ok(decoded.into_owned())
    }
  }

  #[allow(non_snake_case)]
  async fn processResponse(
    &self,
    response: reqwest::Response,
  ) -> Result<ResponseModel, ResponseModel> {
    let contentType = response
      .headers()
      .get(CONTENT_TYPE)
      .and_then(|v| v.to_str().ok())
      .unwrap_or("text/plain")
      .to_string();

    let statusCode = response.status();
    let bytes = match response.bytes().await {
      Ok(bytes) => bytes,
      Err(e) => {
        return Err(ResponseModel {
          status: ResponseStatus::Error,
          message: format!("Failed to read response bytes: {}", e),
          data: DataValue::String("".to_string()),
        })
      }
    };

    let text = if let Some(encoding) = self.detectCharsetFromContentType(&contentType) {
      match self.decodeWithEncoding(&bytes, encoding) {
        Ok(text) => text,
        Err(_) => self.tryDecodeBytes(&bytes),
      }
    } else {
      self.tryDecodeBytes(&bytes)
    };

    let contentTypeLower = contentType.to_lowercase();

    if contentTypeLower.contains("application/json") {
      match serde_json::from_str::<serde_json::Value>(&text) {
        Ok(_) => Ok(ResponseModel {
          status: ResponseStatus::Success,
          message: format!("Valid JSON response (Status: {})", statusCode),
          data: DataValue::String(text),
        }),
        Err(e) => Err(ResponseModel {
          status: ResponseStatus::Error,
          message: format!("Invalid JSON: {}", e),
          data: DataValue::String(text),
        }),
      }
    } else if contentTypeLower.contains("application/xml") || contentTypeLower.contains("text/xml")
    {
      match Document::parse(&text) {
        Ok(_) => Ok(ResponseModel {
          status: ResponseStatus::Success,
          message: format!("Valid XML response (Status: {})", statusCode),
          data: DataValue::String(text),
        }),
        Err(e) => Err(ResponseModel {
          status: ResponseStatus::Error,
          message: format!("Invalid XML: {}", e),
          data: DataValue::String(text),
        }),
      }
    } else if contentTypeLower.contains("text/html") {
      if text
        .trim_start()
        .to_lowercase()
        .starts_with("<!doctype html")
        || text.trim_start().to_lowercase().starts_with("<html")
        || text.contains("<html")
      {
        Ok(ResponseModel {
          status: ResponseStatus::Success,
          message: format!("Valid HTML response (Status: {})", statusCode),
          data: DataValue::String(text),
        })
      } else {
        Ok(ResponseModel {
          status: ResponseStatus::Success,
          message: format!("HTML-like response (Status: {})", statusCode),
          data: DataValue::String(text),
        })
      }
    } else if contentTypeLower.contains("text/") {
      Ok(ResponseModel {
        status: ResponseStatus::Success,
        message: format!("Text response (Status: {})", statusCode),
        data: DataValue::String(text),
      })
    } else {
      Ok(ResponseModel {
        status: ResponseStatus::Success,
        message: format!(
          "Unknown content type response (Status: {}, Content-Type: {})",
          statusCode, contentType
        ),
        data: DataValue::String(text),
      })
    }
  }

  #[allow(non_snake_case)]
  pub async fn sendRequest(
    &self,
    infoRequest: RequestData,
  ) -> Result<ResponseModel, ResponseModel> {
    let client = reqwest::Client::builder()
      .timeout(std::time::Duration::from_secs(30))
      .build()
      .map_err(|e| ResponseModel {
        status: ResponseStatus::Error,
        message: format!("Failed to create HTTP client: {}", e),
        data: DataValue::String("".to_string()),
      })?;

    let mut url: String = infoRequest.url.clone();
    url = url.split('?').collect::<Vec<&str>>()[0].to_string();

    if !infoRequest.params.is_empty() {
      let mut queryParams = Vec::new();

      for param in infoRequest.params.iter() {
        if param.isActive && !param.key.is_empty() {
          queryParams.push(format!("{}={}", &param.key, &param.value));
        }
      }

      if !queryParams.is_empty() {
        url.push('?');
        url.push_str(&queryParams.join("&"));
      }
    }

    let mut headers: HeaderMap = HeaderMap::new();
    for item in infoRequest.headers.iter() {
      if item.isActive && !item.key.is_empty() {
        if let Ok(key) = HeaderName::from_str(item.key.clone().as_str()) {
          if let Ok(value) = item.value.parse() {
            headers.insert(key, value);
          }
        }
      }
    }

    let response_result = match infoRequest.typeReq {
      TypeRequest::GET => client.get(&url).headers(headers).send().await,
      TypeRequest::POST | TypeRequest::PUT => {
        let mut requestBuilder: reqwest::RequestBuilder =
          if infoRequest.typeReq == TypeRequest::POST {
            client.post(&url)
          } else {
            client.put(&url)
          };

        requestBuilder = requestBuilder.headers(headers);

        if !infoRequest.body.is_empty() {
          let mut body_map: serde_json::Map<String, Value> = serde_json::Map::new();

          for rec in infoRequest.body.iter() {
            if rec.isActive && !rec.key.is_empty() {
              let value = match &rec.value {
                BodyValue::String(s) => serde_json::Value::String(s.clone()),
                BodyValue::Number(n) => serde_json::Value::Number(
                  serde_json::Number::from_f64(*n).unwrap_or(serde_json::Number::from(0)),
                ),
                BodyValue::Bool(b) => serde_json::Value::Bool(*b),
                BodyValue::Array(arr) => serde_json::Value::Array(arr.clone()),
                BodyValue::Object(obj) => obj.clone(),
              };
              body_map.insert(rec.key.clone(), value);
            }
          }

          if !body_map.is_empty() {
            requestBuilder = requestBuilder.json(&body_map);
          }
        }

        requestBuilder.send().await
      }
      TypeRequest::DEL => client.delete(&url).headers(headers).send().await,
    };

    match response_result {
      Ok(response) => {
        let isSuccess = response.status().is_success();
        let result = self.processResponse(response).await;

        if !isSuccess {
          match result {
            Ok(mut resp) => {
              resp.message = format!("HTTP Error Response: {}", resp.message);
              Ok(resp)
            }
            Err(resp) => Err(resp),
          }
        } else {
          result
        }
      }
      Err(err) => Err(ResponseModel {
        status: ResponseStatus::Error,
        message: format!("Request error: {}", err),
        data: DataValue::String("".to_string()),
      }),
    }
  }

  #[allow(non_snake_case)]
  pub fn saveData(
    &self,
    appHandle: tauri::AppHandle,
    listCollections: Vec<CollectionData>,
  ) -> Result<ResponseModel, ResponseModel> {
    let documentFolder = appHandle.path().document_dir();
    if documentFolder.is_err() {
      return Err(ResponseModel {
        status: ResponseStatus::Error,
        message: "Error! Failed to get document folder.".to_string(),
        data: DataValue::String("".to_string()),
      });
    }

    let appFolder = documentFolder.unwrap().join(self.homeAppFolder.clone());
    if !Path::new(&appFolder).exists() {
      let resultCreate = std::fs::create_dir(&appFolder);
      if resultCreate.is_err() {
        return Err(ResponseModel {
          status: ResponseStatus::Error,
          message: format!(
            "Error! Failed to create app folder: {:?}",
            resultCreate.unwrap_err()
          ),
          data: DataValue::String("".to_string()),
        });
      }
    }

    let filePath = appFolder.join("collections.json");

    let serializedData = serde_json::to_vec(&listCollections);
    if serializedData.is_err() {
      return Err(ResponseModel {
        status: ResponseStatus::Error,
        message: "Error! Failed to serialize data.".to_string(),
        data: DataValue::String("".to_string()),
      });
    }
    let buf = serializedData.unwrap();

    let writeResult = if Path::new(&filePath).exists() {
      let mut file = File::create(&filePath).expect("open file failed");
      file.write_all(&buf)
    } else {
      let mut file = File::create(&filePath).expect("create file failed");
      file.write_all(&buf)
    };

    if writeResult.is_err() {
      return Err(ResponseModel {
        status: ResponseStatus::Error,
        message: "Error! Failed to write to file.".to_string(),
        data: DataValue::String("".to_string()),
      });
    }

    return Ok(ResponseModel {
      status: ResponseStatus::Success,
      message: "Save successfully!".to_string(),
      data: DataValue::String("".to_string()),
    });
  }

  #[allow(non_snake_case)]
  pub fn getData(&self, appHandle: tauri::AppHandle) -> Result<ResponseModel, ResponseModel> {
    let documentFolder = appHandle.path().document_dir();
    if documentFolder.is_err() {
      return Err(ResponseModel {
        status: ResponseStatus::Error,
        message: "Error! Failed to get document folder.".to_string(),
        data: DataValue::String("".to_string()),
      });
    }

    let appFolder = documentFolder.unwrap().join(self.homeAppFolder.clone());
    if !Path::new(&appFolder).exists() {
      return Err(ResponseModel {
        status: ResponseStatus::Error,
        message: "Error! App folder not found.".to_string(),
        data: DataValue::String("".to_string()),
      });
    }

    let filePath = appFolder.join("collections.json");

    if !Path::new(&filePath).exists() {
      return Err(ResponseModel {
        status: ResponseStatus::Error,
        message: "".to_string(),
        data: DataValue::String("".to_string()),
      });
    }

    let mut file = File::open(&filePath).expect("open file failed");
    let mut buf = String::new();
    let res = file.read_to_string(&mut buf);

    if res.is_err() {
      return Err(ResponseModel {
        status: ResponseStatus::Error,
        message: "Error! Failed to read from file.".to_string(),
        data: DataValue::String("".to_string()),
      });
    }

    let deserializedData: Result<Vec<CollectionData>, serde_json::Error> =
      serde_json::from_str(&buf);

    match deserializedData {
      Ok(data) => {
        return Ok(ResponseModel {
          status: ResponseStatus::Success,
          message: "".to_string(),
          data: self
            .commonHelper
            .convertDataToArray::<CollectionData>(&data),
        });
      }
      Err(_) => {
        return Err(ResponseModel {
          status: ResponseStatus::Error,
          message: "Error parsing data".to_string(),
          data: DataValue::String("".to_string()),
        });
      }
    }
  }
}
