/* sys lib */
use calamine::{open_workbook, Reader, Xlsx};
use rust_xlsxwriter::Workbook;
use std::path::Path;
use tauri::Manager;

/* helpers */
use crate::helpers::common::{convert_data_to_array, get_current_date};

/* models */
use crate::models::response::{DataValue, Response};

/* struct */
struct ExcelData {
  rows: Vec<Vec<String>>,
}

pub fn get_data_file_by_path_xls(file_path: String) -> Response {
  let workbook: Result<Xlsx<std::io::BufReader<std::fs::File>>, calamine::XlsxError> =
    open_workbook::<Xlsx<_>, &Path>(Path::new(&file_path));
  if workbook.is_err() {
    return Response {
      status: "error".to_string(),
      message: "Error! Failed to open file xls!".to_string(),
      data: DataValue::String("".to_string()),
    };
  }

  let sheet_name = &workbook.as_ref().unwrap().sheet_names()[0];
  let mut excel_data = ExcelData { rows: Vec::new() };

  if let Ok(sheet) = workbook.unwrap().worksheet_range(&sheet_name) {
    for row in sheet.rows() {
      let row_data: Vec<String> = row.iter().map(|cell| format!("{}", cell)).collect();
      excel_data.rows.push(row_data);
    }

    return Response {
      status: "success".to_string(),
      message: "".to_string(),
      data: convert_data_to_array::<Vec<String>>(&excel_data.rows),
    };
  } else {
    return Response {
      status: "error".to_string(),
      message: "Failed read file xls!".to_string(),
      data: DataValue::String("".to_string()),
    };
  }
}

pub fn write_data_to_file_xls(
  app_handle: tauri::AppHandle,
  name_file: String,
  content: Vec<Vec<String>>,
) -> Response {
  let full_name: String = format!("{}_{}.{}", name_file, get_current_date(), "xlsx");

  let document_folder = app_handle.path().document_dir();
  if document_folder.is_err() {
    return Response {
      status: "error".to_string(),
      message: "Error! Failed to get document folder.".to_string(),
      data: DataValue::String("".to_string()),
    };
  }

  let app_folder = document_folder.unwrap().join("AllInOneToolkit");
  if !Path::new(&app_folder).exists() {
    let res_create = std::fs::create_dir_all(&app_folder);
    if res_create.is_err() {
      return Response {
        status: "error".to_string(),
        message: format!("Error! Failed to create app folder: {:?}", res_create),
        data: DataValue::String("".to_string()),
      };
    }
  }

  let file_path = app_folder.join(&full_name);

  let mut workbook = Workbook::new();
  let worksheet = workbook.add_worksheet();
  for (row_index, row) in content.iter().enumerate() {
    for (col_index, cell_value) in row.iter().enumerate() {
      worksheet
        .write_string(row_index as u32, col_index as u16, cell_value)
        .unwrap();
    }
  }

  match workbook.save(file_path.clone().to_str().unwrap()) {
    Ok(_) => {
      return Response {
        status: "success".to_string(),
        message: "".to_string(),
        data: DataValue::String(file_path.display().to_string()),
      };
    }
    Err(error) => {
      println!("Error: {}", error);
      return Response {
        status: "error".to_string(),
        message: format!("Error! Failed to write data to file!"),
        data: DataValue::String("".to_string()),
      };
    }
  }
}
