/* sys lib */
use encoding_rs::{ISO_8859_10, WINDOWS_1252};
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
use crate::helpers::common::convert_data_to_array;

use crate::models::response::ResponseStatus;
/* models */
use crate::models::{
  collection_data::CollectionData,
  request_data::{BodyValue, RequestData, TypeRequest},
  response::{DataValue, Response},
};

async fn process_response(response: reqwest::Response) -> Response {
  let content_type = response
    .headers()
    .get(CONTENT_TYPE)
    .and_then(|v| v.to_str().ok())
    .unwrap_or("text/plain")
    .to_string();

  let bytes = match response.bytes().await {
    Ok(bytes) => bytes,
    Err(e) => {
      return Response {
        status: ResponseStatus::Error,
        message: format!("Failed to read response bytes: {}", e),
        data: DataValue::String("".to_string()),
      }
    }
  };

  match content_type.as_str() {
    ct if ct.contains("application/json") => match String::from_utf8(bytes.to_vec()) {
      Ok(text) => Response {
        status: ResponseStatus::Success,
        message: "Valid JSON response".to_string(),
        data: DataValue::String(text),
      },
      Err(e) => Response {
        status: ResponseStatus::Error,
        message: format!("Invalid UTF-8 in JSON: {}", e),
        data: DataValue::String("".to_string()),
      },
    },
    ct if ct.contains("application/xml") || ct.contains("text/xml") => {
      match String::from_utf8(bytes.to_vec()) {
        Ok(xml_text) => match Document::parse(&xml_text) {
          Ok(_) => Response {
            status: ResponseStatus::Success,
            message: "Valid XML response".to_string(),
            data: DataValue::String(xml_text),
          },
          Err(e) => Response {
            status: ResponseStatus::Error,
            message: format!("Invalid XML: {}", e),
            data: DataValue::String("".to_string()),
          },
        },
        Err(utf8_err) => {
          return Response {
            status: ResponseStatus::Error,
            message: format!("Invalid UTF-8 in XML: {}", utf8_err),
            data: DataValue::String("".to_string()),
          };
          // Fallback to ISO-8859-1 decoding
          // let (iso_decoded, _, iso_had_errors) = ISO_8859_10.decode(&bytes);
          // if !iso_had_errors {
          //   let xml_text = iso_decoded.into_owned();
          //   match Document::parse(&xml_text) {
          //     Ok(_) => Response {
          //       status: ResponseStatus::Success,
          //       message: "Valid XML response (ISO-8859-1 decoded)".to_string(),
          //       data: DataValue::String(xml_text),
          //     },
          //     Err(e) => {
          //       // Fallback to Windows-1252 decoding
          //       let (win_decoded, _, win_had_errors) = WINDOWS_1252.decode(&bytes);
          //       if !win_had_errors {
          //         let xml_text = win_decoded.into_owned();
          //         match Document::parse(&xml_text) {
          //           Ok(_) => Response {
          //             status: ResponseStatus::Success,
          //             message: "Valid XML response (Windows-1252 decoded)".to_string(),
          //             data: DataValue::String(xml_text),
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
          // Basic HTML validation
          if text.contains("<html") || text.contains("<!DOCTYPE html") {
            Response {
              status: ResponseStatus::Success,
              message: "Valid HTML response".to_string(),
              data: DataValue::String(text),
            }
          } else {
            Response {
              status: ResponseStatus::Error,
              message: "Invalid HTML structure".to_string(),
              data: DataValue::String("".to_string()),
            }
          }
        }
        Err(e) => Response {
          status: ResponseStatus::Error,
          message: format!("Invalid UTF-8 in HTML: {}", e),
          data: DataValue::String("".to_string()),
        },
      }
    }
    ct if ct.contains("charset=iso-8859-1") => {
      let (decoded, _, had_errors) = ISO_8859_10.decode(&bytes);
      if had_errors {
        Response {
          status: ResponseStatus::Error,
          message: "Decoding errors in ISO-8859-1".to_string(),
          data: DataValue::String("".to_string()),
        }
      } else {
        Response {
          status: ResponseStatus::Success,
          message: "".to_string(),
          data: DataValue::String(decoded.into_owned()),
        }
      }
    }
    _ => Response {
      status: ResponseStatus::Error,
      message: format!("Unsupported content type: {}", content_type),
      data: DataValue::String("".to_string()),
    },
  }
}

pub async fn send_request(info_request: RequestData) -> Response {
  let client = reqwest::Client::new();

  let mut url: String = info_request.url.clone();
  url = url.split('?').collect::<Vec<&str>>()[0].to_string();

  if !info_request.params.is_empty() {
    url.push('?');

    for param in info_request.params.iter() {
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
  for item in info_request.headers.iter() {
    if item.isActive && !item.key.is_empty() {
      if let Ok(key) = HeaderName::from_str(item.key.clone().as_str()) {
        if let Ok(value) = item.value.parse() {
          headers.insert(key, value);
        }
      }
    }
  }

  let body: serde_json::Value = serde_json::json!({});
  if info_request.typeReq == TypeRequest::POST || info_request.typeReq == TypeRequest::PUT {
    let mut body_map: serde_json::Map<String, Value> = serde_json::Map::new();
    for rec in info_request.body.iter() {
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
          BodyValue::Object(obj) => serde_json::to_value::<serde_json::Value>(obj.clone()).unwrap(),
        };
        body_map.insert(rec.key.clone(), value);
      }
    }
  }

  let response_result = match info_request.typeReq {
    TypeRequest::GET => client.get(&url).headers(headers).send().await,
    TypeRequest::POST => client.post(&url).headers(headers).json(&body).send().await,
    TypeRequest::PUT => client.put(&url).headers(headers).json(&body).send().await,
    TypeRequest::DEL => client.delete(&url).headers(headers).send().await,
  };

  match response_result {
    Ok(response) => {
      if response.status().is_success() {
        process_response(response).await
      } else {
        Response {
          status: ResponseStatus::Error,
          message: format!("Request failed with status: {}", response.status()),
          data: DataValue::String("".to_string()),
        }
      }
    }
    Err(err) => Response {
      status: ResponseStatus::Error,
      message: format!("Request error: {:?}", err),
      data: DataValue::String("".to_string()),
    },
  }
}

pub fn save_data(app_handle: tauri::AppHandle, list_collections: Vec<CollectionData>) -> Response {
  let document_folder = app_handle.path().document_dir();
  if document_folder.is_err() {
    return Response {
      status: ResponseStatus::Error,
      message: "Error! Failed to get document folder.".to_string(),
      data: DataValue::String("".to_string()),
    };
  }

  let app_folder = document_folder.unwrap().join("AllInOneToolkit");
  if !Path::new(&app_folder).exists() {
    let res_create = std::fs::create_dir(&app_folder);
    if res_create.is_err() {
      return Response {
        status: ResponseStatus::Error,
        message: format!(
          "Error! Failed to create app folder: {:?}",
          res_create.unwrap_err()
        ),
        data: DataValue::String("".to_string()),
      };
    }
  }

  let file_path = app_folder.join("collections.json");

  let serialized_data = serde_json::to_vec(&list_collections);
  if serialized_data.is_err() {
    return Response {
      status: ResponseStatus::Error,
      message: "Error! Failed to serialize data.".to_string(),
      data: DataValue::String("".to_string()),
    };
  }
  let buf = serialized_data.unwrap();

  let write_result = if Path::new(&file_path).exists() {
    let mut file = File::create(&file_path).expect("open file failed");
    file.write_all(&buf)
  } else {
    let mut file = File::create(&file_path).expect("create file failed");
    file.write_all(&buf)
  };

  if write_result.is_err() {
    return Response {
      status: ResponseStatus::Error,
      message: "Error! Failed to write to file.".to_string(),
      data: DataValue::String("".to_string()),
    };
  }

  return Response {
    status: ResponseStatus::Success,
    message: "Save successfully!".to_string(),
    data: DataValue::String("".to_string()),
  };
}

pub fn get_data(app_handle: tauri::AppHandle) -> Response {
  let document_folder = app_handle.path().document_dir();
  if document_folder.is_err() {
    return Response {
      status: ResponseStatus::Error,
      message: "Error! Failed to get document folder.".to_string(),
      data: DataValue::String("".to_string()),
    };
  }

  let app_folder = document_folder.unwrap().join("AllInOneToolkit");
  if !Path::new(&app_folder).exists() {
    return Response {
      status: ResponseStatus::Error,
      message: "Error! App folder not found.".to_string(),
      data: DataValue::String("".to_string()),
    };
  }

  let file_path = app_folder.join("collections.json");

  if !Path::new(&file_path).exists() {
    return Response {
      status: ResponseStatus::Error,
      message: "".to_string(),
      data: DataValue::String("".to_string()),
    };
  }

  let mut file = File::open(&file_path).expect("open file failed");
  let mut buf = String::new();
  let res = file.read_to_string(&mut buf);

  if res.is_err() {
    return Response {
      status: ResponseStatus::Error,
      message: "Error! Failed to read from file.".to_string(),
      data: DataValue::String("".to_string()),
    };
  }

  let deserialized_data: Result<Vec<CollectionData>, serde_json::Error> =
    serde_json::from_str(&buf);

  match deserialized_data {
    Ok(data) => {
      return Response {
        status: ResponseStatus::Success,
        message: "".to_string(),
        data: convert_data_to_array::<CollectionData>(&data),
      };
    }
    Err(_) => {
      return Response {
        status: ResponseStatus::Error,
        message: "Error parsing data".to_string(),
        data: DataValue::String("".to_string()),
      };
    }
  }
}
