/* sys lib */
use dotenv::dotenv;
use encoding_rs::{ISO_8859_10, WINDOWS_1252};
use reqwest::header::CONTENT_TYPE;
use roxmltree::Document;
use serde_json::Value;
use std::env;
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
  pub fn new() -> Self {
    dotenv().ok();
    Self {
      commonHelper: CommonHelper::new(),
      homeAppFolder: env::var("HOME_APP_FOLDER").expect("HOME_APP_FOLDER not set"),
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

    match contentType.as_str() {
      ct if ct.contains("application/json") => match String::from_utf8(bytes.to_vec()) {
        Ok(text) => Ok(ResponseModel {
          status: ResponseStatus::Success,
          message: "Valid JSON response".to_string(),
          data: DataValue::String(text),
        }),
        Err(e) => Err(ResponseModel {
          status: ResponseStatus::Error,
          message: format!("Invalid UTF-8 in JSON: {}", e),
          data: DataValue::String("".to_string()),
        }),
      },
      ct if ct.contains("application/xml") || ct.contains("text/xml") => {
        match String::from_utf8(bytes.to_vec()) {
          Ok(xmlText) => match Document::parse(&xmlText) {
            Ok(_) => Ok(ResponseModel {
              status: ResponseStatus::Success,
              message: "Valid XML response".to_string(),
              data: DataValue::String(xmlText),
            }),
            Err(e) => Err(ResponseModel {
              status: ResponseStatus::Error,
              message: format!("Invalid XML: {}", e),
              data: DataValue::String("".to_string()),
            }),
          },
          Err(utf8_err) => {
            return Err(ResponseModel {
              status: ResponseStatus::Error,
              message: format!("Invalid UTF-8 in XML: {}", utf8_err),
              data: DataValue::String("".to_string()),
            });
            // Fallback to ISO-8859-1 decoding
            // let (iso_decoded, _, iso_hadErrors) = ISO_8859_10.decode(&bytes);
            // if !iso_hadErrors {
            //   let xmlText = iso_decoded.into_owned();
            //   match Document::parse(&xmlText) {
            //     Ok(_) => Response {
            //       status: ResponseStatus::Success,
            //       message: "Valid XML response (ISO-8859-1 decoded)".to_string(),
            //       data: DataValue::String(xmlText),
            //     },
            //     Err(e) => {
            //       // Fallback to Windows-1252 decoding
            //       let (win_decoded, _, win_hadErrors) = WINDOWS_1252.decode(&bytes);
            //       if !win_hadErrors {
            //         let xmlText = win_decoded.into_owned();
            //         match Document::parse(&xmlText) {
            //           Ok(_) => Response {
            //             status: ResponseStatus::Success,
            //             message: "Valid XML response (Windows-1252 decoded)".to_string(),
            //             data: DataValue::String(xmlText),
            //           },
            //           Err(e) => Response {
            //             status: ResponseStatus::Error,
            //             message: format!(
            //               "Invalid XML structure after Windows-1252 decoding: {}. Raw response: {:?}",
            //               e,
            //               String::from_utf8_lossy(&bytes)
            //             ),
            //             data: DataValue::String("".to_string()),
            //           },
            //         }
            //       } else {
            //         Response {
            //           status: ResponseStatus::Error,
            //           message: format!(
            //             "Failed to decode as ISO-8859-1: {}. Invalid XML after decoding: {}. Raw response: {:?}",
            //             utf8_err, e, String::from_utf8_lossy(&bytes)
            //           ),
            //           data: DataValue::String("".to_string()),
            //         }
            //       }
            //     }
            //   }
            // } else {
            //   Response {
            //     status: ResponseStatus::Error,
            //     message: format!(
            //       "Failed to decode as ISO-8859-1 after UTF-8 error: {}. Raw response: {:?}",
            //       utf8_err, String::from_utf8_lossy(&bytes)
            //     ),
            //     data: DataValue::String("".to_string()),
            //   }
            // }
          }
        }
      }
      ct if ct.contains("charset=utf-8") || ct.contains("text/html") => {
        match String::from_utf8(bytes.to_vec()) {
          Ok(text) => {
            if text.contains("<html") || text.contains("<!DOCTYPE html") {
              Ok(ResponseModel {
                status: ResponseStatus::Success,
                message: "Valid HTML response".to_string(),
                data: DataValue::String(text),
              })
            } else {
              Err(ResponseModel {
                status: ResponseStatus::Error,
                message: "Invalid HTML structure".to_string(),
                data: DataValue::String("".to_string()),
              })
            }
          }
          Err(e) => Err(ResponseModel {
            status: ResponseStatus::Error,
            message: format!("Invalid UTF-8 in HTML: {}", e),
            data: DataValue::String("".to_string()),
          }),
        }
      }
      ct if ct.contains("charset=iso-8859-1") => {
        let (decoded, _, hadErrors) = ISO_8859_10.decode(&bytes);
        if hadErrors {
          Err(ResponseModel {
            status: ResponseStatus::Error,
            message: "Decoding errors in ISO-8859-1".to_string(),
            data: DataValue::String("".to_string()),
          })
        } else {
          Ok(ResponseModel {
            status: ResponseStatus::Success,
            message: "".to_string(),
            data: DataValue::String(decoded.into_owned()),
          })
        }
      }
      _ => Err(ResponseModel {
        status: ResponseStatus::Error,
        message: format!("Unsupported content type: {}", contentType),
        data: DataValue::String("".to_string()),
      }),
    }
  }

  #[allow(non_snake_case)]
  pub async fn sendRequest(
    &self,
    infoRequest: RequestData,
  ) -> Result<ResponseModel, ResponseModel> {
    let client = reqwest::Client::new();

    let mut url: String = infoRequest.url.clone();
    url = url.split('?').collect::<Vec<&str>>()[0].to_string();

    if !infoRequest.params.is_empty() {
      url.push('?');

      for param in infoRequest.params.iter() {
        if param.isActive && !param.key.is_empty() {
          url = format!(
            "{}{}{}={}",
            url,
            if url.ends_with('?') { "" } else { "&" },
            param.key,
            param.value.clone()
          );
        }
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

    let body: serde_json::Value = serde_json::json!({});
    if infoRequest.typeReq == TypeRequest::POST || infoRequest.typeReq == TypeRequest::PUT {
      let mut body_map: serde_json::Map<String, Value> = serde_json::Map::new();
      for rec in infoRequest.body.iter() {
        if rec.isActive && !rec.key.is_empty() {
          let value = match &rec.value {
            BodyValue::String(s) => serde_json::to_value::<String>(s.to_string()).unwrap(),
            BodyValue::Number(n) => serde_json::to_value::<f64>(n.clone()).unwrap(),
            BodyValue::Bool(b) => serde_json::to_value::<bool>(b.clone()).unwrap(),
            BodyValue::Array(arr) => {
              let mut json_arr = String::new();
              json_arr.push_str("[");
              for (i, v) in arr.iter().enumerate() {
                json_arr.push_str(&format!("{}{}", if i > 0 { "," } else { "" }, v));
              }
              json_arr.push_str("]");
              serde_json::to_value::<Vec<serde_json::Value>>(arr.clone()).unwrap()
            }
            BodyValue::Object(obj) => {
              serde_json::to_value::<serde_json::Value>(obj.clone()).unwrap()
            }
          };
          body_map.insert(rec.key.clone(), value);
        }
      }
    }

    let response_result = match infoRequest.typeReq {
      TypeRequest::GET => client.get(&url).headers(headers).send().await,
      TypeRequest::POST => client.post(&url).headers(headers).json(&body).send().await,
      TypeRequest::PUT => client.put(&url).headers(headers).json(&body).send().await,
      TypeRequest::DEL => client.delete(&url).headers(headers).send().await,
    };

    match response_result {
      Ok(response) => {
        if response.status().is_success() {
          self.processResponse(response).await
        } else {
          Err(ResponseModel {
            status: ResponseStatus::Error,
            message: format!("Request failed with status: {}", response.status()),
            data: DataValue::String("".to_string()),
          })
        }
      }
      Err(err) => Err(ResponseModel {
        status: ResponseStatus::Error,
        message: format!("Request error: {:?}", err),
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
