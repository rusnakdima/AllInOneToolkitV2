/* sys lib */
use std::collections::HashMap;
use std::str::FromStr;
use std::{fs::File, path::Path};
use std::io::{Read, Write};
use tauri::Manager;
use tauri_plugin_http::reqwest;
use tauri::http::{HeaderMap, HeaderName};

/* helpers */
use crate::helpers::common::convert_data_to_array;

/* models */
use crate::models::{
  collection_data::CollectionData,
  request_data::{
    RequestData,
    TypeRequest,
    BodyValue,
  },
  response::{
    DataValue,
    Response
  },
};

pub async fn send_request(info_request: RequestData) -> Response {
  let client = reqwest::Client::new();

  let mut url: String = info_request.url.clone();
  url = url.split('?').collect::<Vec<&str>>()[0].to_string();

  if !info_request.params.is_empty() {
    url.push('?');

    for param in info_request.params.iter() {
      if param.isActive {
        if param.key != "" {
          url = format!("{}{}{}={}", url, if url.ends_with('?') { "" } else { "&" }, param.key, param.value.clone());
        }
      }
    }
  }

  let mut headers: HeaderMap = HeaderMap::new();

  for item in info_request.headers.iter() {
    if item.isActive {
      if item.key != "" {
        let key = HeaderName::from_str(item.key.clone().as_str()).unwrap();
        let value = item.value.clone();

        headers.insert(key, value.parse().unwrap());
      }
    }
  }

  let mut body: HashMap<String, serde_json::Value> = HashMap::new();

  for rec in info_request.body.iter() {
    if rec.isActive {
      if rec.key != "" {
        let mut value: serde_json::Value;

        match &rec.value {
          BodyValue::String(s) => value = serde_json::to_value::<String>(s.to_string()).unwrap(),
          BodyValue::Number(n) => value = serde_json::to_value::<f64>(n.clone()).unwrap(),
          BodyValue::Bool(b) => value = serde_json::to_value::<bool>(b.clone()).unwrap(),
          BodyValue::Array(arr) => {
            let mut json_arr = String::new();
            json_arr.push_str("[");
            for (i, v) in arr.iter().enumerate() {
              json_arr.push_str(&format!("{}{}", if i > 0 { "," } else { "" }, v));
            }
            json_arr.push_str("]");
            value = serde_json::to_value::<Vec<serde_json::Value>>(arr.clone()).unwrap();
          },
          BodyValue::Object(obj) => {
            value = serde_json::to_value::<serde_json::Value>(obj.clone()).unwrap();
          },
        }

        body.insert(rec.key.clone(), value.clone());
      }
    }
  }

  match info_request.typeReq {
    TypeRequest::GET => {
      let response_result = client
        .get(url)
        .headers(headers)
        .send()
        .await;

      match response_result {
        Ok(response) => {
          let bytes_result = response.bytes().await;
          match bytes_result {
            Ok(bytes) => {
              let json_result = serde_json::from_slice::<serde_json::Value>(&bytes);
              if let Ok(json) = json_result {
                return Response {
                  status: "success".to_string(),
                  message: "".to_string(),
                  data: DataValue::Object(json),
                };
              }

              let text = String::from_utf8_lossy(&bytes).to_string();
              return Response {
                status: "success".to_string(),
                message: "".to_string(),
                data: DataValue::String(text),
              };
            }
            Err(err) => {
              return Response {
                status: "error".to_string(),
                message: format!("Error: {:?}", err),
                data: DataValue::String("".to_string()),
              };
            }
          }
        }
        Err(err) => {
          return Response {
            status: "error".to_string(),
            message: format!("Error: {}", err),
            data: DataValue::String("".to_string()),
          }
        }
      }
    }
    TypeRequest::POST => {
      let response_result: Result<reqwest::Response, reqwest::Error> = client
        .post(url)
        .headers(headers)
        .json(&body)
        .send()
        .await;

      match response_result {
        Ok(response) => {
          let bytes_result = response.bytes().await;
          match bytes_result {
            Ok(bytes) => {
              let json_result = serde_json::from_slice::<serde_json::Value>(&bytes);
              if let Ok(json) = json_result {
                return Response {
                  status: "success".to_string(),
                  message: "".to_string(),
                  data: DataValue::Object(json),
                };
              }

              let text = String::from_utf8_lossy(&bytes).to_string();
              return Response {
                status: "success".to_string(),
                message: "".to_string(),
                data: DataValue::String(text),
              };
            }
            Err(err) => {
              return Response {
                status: "error".to_string(),
                message: format!("Error: {:?}", err),
                data: DataValue::String("".to_string()),
              };
            }
          }
        }
        Err(err) => {
          return Response {
            status: "error".to_string(),
            message: format!("Error: {:?}", err),
            data: DataValue::String("".to_string()),
          };
        }
      }
    }
    TypeRequest::PUT => {
      let response_result = client
        .put(url)
        .headers(headers)
        .json(&body)
        .send()
        .await;

      match response_result {
        Ok(response) => {
          let bytes_result = response.bytes().await;
          match bytes_result {
            Ok(bytes) => {
              let json_result = serde_json::from_slice::<serde_json::Value>(&bytes);
              if let Ok(json) = json_result {
                return Response {
                  status: "success".to_string(),
                  message: "".to_string(),
                  data: DataValue::Object(json),
                };
              }

              let text = String::from_utf8_lossy(&bytes).to_string();
              return Response {
                status: "success".to_string(),
                message: "".to_string(),
                data: DataValue::String(text),
              };
            }
            Err(err) => {
              return Response {
                status: "error".to_string(),
                message: format!("Error: {:?}", err),
                data: DataValue::String("".to_string()),
              };
            }
          }
        }
        Err(err) => {
          return Response {
            status: "error".to_string(),
            message: format!("Error: {}", err),
            data: DataValue::String("".to_string()),
          }
        }
      }
    }
    TypeRequest::DEL => {
      let response_result = client
        .delete(url)
        .headers(headers)
        .send()
        .await;

      match response_result {
        Ok(response) => {
          let bytes_result = response.bytes().await;
          match bytes_result {
            Ok(bytes) => {
              let json_result = serde_json::from_slice::<serde_json::Value>(&bytes);
              if let Ok(json) = json_result {
                return Response {
                  status: "success".to_string(),
                  message: "".to_string(),
                  data: DataValue::Object(json),
                };
              }

              let text = String::from_utf8_lossy(&bytes).to_string();
              return Response {
                status: "success".to_string(),
                message: "".to_string(),
                data: DataValue::String(text),
              };
            }
            Err(err) => {
              return Response {
                status: "error".to_string(),
                message: format!("Error: {:?}", err),
                data: DataValue::String("".to_string()),
              };
            }
          }
        }
        Err(err) => {
          return Response {
            status: "error".to_string(),
            message: format!("Error: {:?}", err),
            data: DataValue::String("".to_string()),
          };
        }
      }
    }
  };
}

pub fn save_data(app_handle: tauri::AppHandle, list_collections: Vec<CollectionData>) -> Response {
  let document_folder = app_handle.path().document_dir();
  if document_folder.is_err() {
    return Response {
      status: "error".to_string(),
      message: "Error! Failed to get document folder.".to_string(),
      data: DataValue::String("".to_string())
    };
  }

  let app_folder = document_folder.unwrap().join("AllInOneToolkit");
  if !Path::new(&app_folder).exists() {
    let res_create = std::fs::create_dir(&app_folder);
    if res_create.is_err() {
      return Response {
        status: "error".to_string(),
        message: format!("Error! Failed to create app folder: {:?}", res_create.unwrap_err()),
        data: DataValue::String("".to_string())
      };
    }
  }

  let file_path = app_folder.join("collections.json");

  let serialized_data = serde_json::to_vec(&list_collections);
  if serialized_data.is_err() {
    return Response {
      status: "error".to_string(),
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
      status: "error".to_string(),
      message: "Error! Failed to write to file.".to_string(),
      data: DataValue::String("".to_string()),
    };
  }

  return Response {
    status: "success".to_string(),
    message: "Save successfully!".to_string(),
    data: DataValue::String("".to_string())
  };
}

pub fn get_data(app_handle: tauri::AppHandle) -> Response {
  let document_folder = app_handle.path().document_dir();
  if document_folder.is_err() {
    return Response {
      status: "error".to_string(),
      message: "Error! Failed to get document folder.".to_string(),
      data: DataValue::String("".to_string())
    };
  }

  let app_folder = document_folder.unwrap().join("AllInOneToolkit");
  if!Path::new(&app_folder).exists() {
    return Response {
      status: "error".to_string(),
      message: "Error! App folder not found.".to_string(),
      data: DataValue::String("".to_string())
    };
  }

  let file_path = app_folder.join("collections.json");

  if !Path::new(&file_path).exists() {
    return Response {
      status: "error".to_string(),
      message: "".to_string(),
      data: DataValue::String("".to_string()),
    };
  }

  let mut file = File::open(&file_path).expect("open file failed");
  let mut buf = String::new();
  let res = file.read_to_string(&mut buf);

  if res.is_err() {
    return Response {
      status: "error".to_string(),
      message: "Error! Failed to read from file.".to_string(),
      data: DataValue::String("".to_string()),
    };
  }

  let deserialized_data: Result<Vec<CollectionData>, serde_json::Error> = serde_json::from_str(&buf);

  match deserialized_data {
    Ok(data) => {
      return Response {
        status: "success".to_string(),
        message: "".to_string(),
        data: convert_data_to_array::<CollectionData>(&data),
      };
    }
    Err(_) => {
      return Response {
        status: "error".to_string(),
        message: "Error parsing data".to_string(),
        data: DataValue::String("".to_string())
      };
    }
  }

}