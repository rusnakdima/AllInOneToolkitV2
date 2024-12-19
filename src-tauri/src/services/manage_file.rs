/* sys lib */
use std::fs::File;
use std::io::Read;
use std::io::Write;
use std::path::Path;
use tauri::Emitter;
use tauri::Manager;
use tauri_plugin_dialog::DialogExt;

/* helpers */
use crate::helpers::common;

/* models */
use crate::models::response::{
  DataValue,
  Response
};

fn send_file_path(app_handle: tauri::AppHandle, file_path: String) {
  let _ = app_handle.emit("send_file_path", file_path);
}

pub fn open_dialog_window(app_handle: tauri::AppHandle, type_file: &str) -> Response {
  let mut _name_filter: String = String::new();
  let mut _list_ext: Vec<&str> = Vec::new();
  if type_file == "xls" {
    _name_filter = "Excel Files".to_string();
    _list_ext = vec![&"xls", &"xlsx", &"xlsm"];
  } else {
    _name_filter = format!("{} file", type_file.to_uppercase());
    _list_ext = vec![type_file];
  }

  app_handle
    .dialog()
    .file()
    .add_filter(_name_filter, &_list_ext)
    .pick_file(|file_path| match file_path {
      Some(path) => {
        let _ = send_file_path(app_handle, path.as_path().unwrap().to_str().unwrap().to_string());
      },
      _ => {}
    });

  return Response {
    status: "error".to_string(),
    message: "Error!".to_string(),
    data: DataValue::String("".to_string())
  }
}

pub fn get_data_file_by_path(file_path: String) -> Response {
  let mut file = File::open(&file_path).unwrap();
  let mut content = String::new();
  let result = file.read_to_string(&mut content);

  match result {
    Ok(_) => {
      return Response {
        status: "success".to_string(),
        message: "".to_string(),
        data: DataValue::String(content)
      };
    }
    Err(err) => {
      return Response {
        status: "error".to_string(),
        message: format!("Error: {:?}!", err),
        data: DataValue::String("".to_string())
      };
    }
  }
}

pub fn write_data_to_file(app_handle: tauri::AppHandle, name_file: String, content: String, extension: String) -> Response {
  let full_name: String = format!("{}_{}.{}", name_file, common::get_current_date(), extension);

  let document_folder = app_handle
    .path()
    .document_dir();
  if document_folder.is_err() {
    return Response {
      status: "error".to_string(),
      message: "Error! Failed to get document folder.".to_string(),
      data: DataValue::String("".to_string())
    };
  }

  let app_folder = document_folder.unwrap().join("AllInOneToolkit");
  if !Path::new(&app_folder).exists() {
    let res_create = std::fs::create_dir_all(&app_folder);
    if res_create.is_err() {
      return Response {
        status: "error".to_string(),
        message: format!("Error! Failed to create app folder: {:?}", res_create),
        data: DataValue::String("".to_string())
      };
    }
  }

  let file_path = app_folder.join(&full_name);
  let data_file = File::create(&file_path);
  if data_file.is_err() {
    return Response {
      status: "error".to_string(),
      message: format!("Error! Failed to create file!"),
      data: DataValue::String("".to_string())
    };
  }

  let result_write = data_file.unwrap().write(content.as_bytes());
  if result_write.is_err() {
    return Response {
      status: "error".to_string(),
      message: format!("Error! Failed to write data to file!"),
      data: DataValue::String("".to_string())
    };
  }

  return Response {
    status: "success".to_string(),
    message: "".to_string(),
    data: DataValue::String(file_path.display().to_string())
  };
}

pub fn open_file(path: String) -> Response {
  if let Err(err) = opener::open(path) {
    return Response {
      status: "error".to_string(),
      message: format!("Failed to open file:: {}", err),
      data: DataValue::String("".to_string())
    }
  }

  return Response {
    status: "success".to_string(),
    message: "".to_string(),
    data: DataValue::String("".to_string())
  };
}