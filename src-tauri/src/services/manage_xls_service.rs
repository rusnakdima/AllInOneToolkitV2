/* sys lib */
use calamine::{open_workbook, Reader, Xlsx};
use rust_xlsxwriter::Workbook;
use std::path::Path;
use tauri::Manager;

/* helpers */
use crate::helpers::common::CommonHelper;

/* models */
use crate::models::response::{DataValue, ResponseModel, ResponseStatus};

/* struct */
struct ExcelData {
  rows: Vec<Vec<String>>,
}

#[allow(non_snake_case)]
pub struct ManageXlsService {
  pub commonHelper: CommonHelper,
}

impl ManageXlsService {
  pub fn new() -> Self {
    Self {
      commonHelper: CommonHelper::new(),
    }
  }

  #[allow(non_snake_case)]
  pub fn getDataFileByPathXls(&self, filePath: String) -> Result<ResponseModel, ResponseModel> {
    let workbook: Result<Xlsx<std::io::BufReader<std::fs::File>>, calamine::XlsxError> =
      open_workbook::<Xlsx<_>, &Path>(Path::new(&filePath));
    if workbook.is_err() {
      return Err(ResponseModel {
        status: ResponseStatus::Error,
        message: "Error! Failed to open file xls!".to_string(),
        data: DataValue::String("".to_string()),
      });
    }

    let sheetName = &workbook.as_ref().unwrap().sheet_names()[0];
    let mut excelData = ExcelData { rows: Vec::new() };

    if let Ok(sheet) = workbook.unwrap().worksheet_range(&sheetName) {
      for row in sheet.rows() {
        let rowData: Vec<String> = row.iter().map(|cell| format!("{}", cell)).collect();
        excelData.rows.push(rowData);
      }

      return Ok(ResponseModel {
        status: ResponseStatus::Success,
        message: "".to_string(),
        data: CommonHelper::new().convertDataToArray::<Vec<String>>(&excelData.rows),
      });
    } else {
      return Err(ResponseModel {
        status: ResponseStatus::Error,
        message: "Failed read file xls!".to_string(),
        data: DataValue::String("".to_string()),
      });
    }
  }

  #[allow(non_snake_case)]
  pub fn writeDataToFileXls(
    &self,
    appHandle: tauri::AppHandle,
    nameFile: String,
    content: Vec<Vec<String>>,
  ) -> Result<ResponseModel, ResponseModel> {
    let fullName: String = format!(
      "{}_{}.{}",
      nameFile,
      self.commonHelper.getCurrentDate(),
      "xlsx"
    );

    let documentFolder = appHandle.path().document_dir();
    if documentFolder.is_err() {
      return Err(ResponseModel {
        status: ResponseStatus::Error,
        message: "Error! Failed to get document folder.".to_string(),
        data: DataValue::String("".to_string()),
      });
    }

    let appFolder = documentFolder.unwrap().join("AllInOneToolkit");
    if !Path::new(&appFolder).exists() {
      let responseCreate = std::fs::create_dir_all(&appFolder);
      if responseCreate.is_err() {
        return Err(ResponseModel {
          status: ResponseStatus::Error,
          message: format!("Error! Failed to create app folder: {:?}", responseCreate),
          data: DataValue::String("".to_string()),
        });
      }
    }

    let filePath = appFolder.join(&fullName);

    let mut workbook = Workbook::new();
    let worksheet = workbook.add_worksheet();
    for (rowIndex, row) in content.iter().enumerate() {
      for (colIndex, cell_value) in row.iter().enumerate() {
        worksheet
          .write_string(rowIndex as u32, colIndex as u16, cell_value)
          .unwrap();
      }
    }

    match workbook.save(filePath.clone().to_str().unwrap()) {
      Ok(_) => {
        return Ok(ResponseModel {
          status: ResponseStatus::Success,
          message: "".to_string(),
          data: DataValue::String(filePath.display().to_string()),
        });
      }
      Err(error) => {
        println!("Error: {}", error);
        return Err(ResponseModel {
          status: ResponseStatus::Error,
          message: format!("Error! Failed to write data to file!"),
          data: DataValue::String("".to_string()),
        });
      }
    }
  }
}
