/* sys lib */
use dotenv::dotenv;
use std::env;
use std::fs::File;
use std::io::Read;
use std::io::Write;
use std::path::Path;
use tauri::Emitter;
use tauri::Manager;
use tauri_plugin_dialog::DialogExt;

/* helpers */
use crate::helpers::common::CommonHelper;

/* models */
use crate::models::response::{DataValue, ResponseModel, ResponseStatus};

#[allow(non_snake_case)]
pub struct ManageFileService {
  pub commonHelper: CommonHelper,
  pub homeAppFolder: String,
}

impl ManageFileService {
  pub fn new() -> Self {
    dotenv().ok();
    Self {
      commonHelper: CommonHelper::new(),
      homeAppFolder: env::var("HOME_APP_FOLDER").expect("HOME_APP_FOLDER not set"),
    }
  }

  #[allow(non_snake_case)]
  pub fn openDialogWindow(
    &self,
    appHandle: tauri::AppHandle,
    typeFile: Vec<&str>,
  ) -> Result<ResponseModel, ResponseModel> {
    let mut nameFilter: String = String::new();
    let mut listExt: Vec<&str> = Vec::new();

    if typeFile.contains(&"xls") || typeFile.contains(&"xlsx") {
      nameFilter = "Excel Files".to_string();
      listExt = vec![&"xls", &"xlsx", &"xlsm"];
    } else {
      nameFilter = format!("{} file", typeFile.join(",").to_uppercase());
      listExt = typeFile;
    }

    let (tx, rx) = std::sync::mpsc::channel();
    let appHandleClone = appHandle.clone();

    appHandle
      .dialog()
      .file()
      .add_filter(nameFilter, &listExt)
      .pick_file(move |filePath| match filePath {
        Some(path) => {
          if let Some(path_str) = path.as_path().unwrap().to_str() {
            let filePathString = path_str.to_string();

            let _ = appHandleClone
              .emit("send-file-path", filePathString.clone())
              .unwrap();

            let _ = tx.send(Ok(ResponseModel {
              status: ResponseStatus::Success,
              message: "File selected successfully".to_string(),
              data: DataValue::String(filePathString),
            }));
          } else {
            let _ = tx.send(Err(ResponseModel {
              status: ResponseStatus::Error,
              message: "Failed to convert file path to string".to_string(),
              data: DataValue::String("".to_string()),
            }));
          }
        }
        None => {
          let _ = tx.send(Err(ResponseModel {
            status: ResponseStatus::Error,
            message: "No file selected or dialog cancelled".to_string(),
            data: DataValue::String("".to_string()),
          }));
        }
      });

    match rx.recv() {
      Ok(result) => result,
      Err(_) => Err(ResponseModel {
        status: ResponseStatus::Error,
        message: "Failed to receive dialog result".to_string(),
        data: DataValue::String("".to_string()),
      }),
    }
  }

  #[allow(non_snake_case)]
  pub fn getDataFileByPath(&self, filePath: String) -> Result<ResponseModel, ResponseModel> {
    let mut file = File::open(&filePath).unwrap();
    let mut content = String::new();
    let result = file.read_to_string(&mut content);

    match result {
      Ok(_) => {
        return Ok(ResponseModel {
          status: ResponseStatus::Success,
          message: "".to_string(),
          data: DataValue::String(content),
        });
      }
      Err(err) => {
        return Err(ResponseModel {
          status: ResponseStatus::Error,
          message: format!("Error: {:?}!", err),
          data: DataValue::String("".to_string()),
        });
      }
    }
  }

  #[allow(non_snake_case)]
  pub fn writeDataToFile(
    &self,
    appHandle: tauri::AppHandle,
    nameFile: String,
    content: String,
    extension: String,
  ) -> Result<ResponseModel, ResponseModel> {
    let fullName: String = format!(
      "{}_{}.{}",
      nameFile,
      self.commonHelper.getCurrentDate(),
      extension
    );

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
    let dataFile = File::create(&filePath);
    if dataFile.is_err() {
      return Err(ResponseModel {
        status: ResponseStatus::Error,
        message: format!("Error! Failed to create file!"),
        data: DataValue::String("".to_string()),
      });
    }

    let resultWrite = dataFile.unwrap().write(content.as_bytes());
    if resultWrite.is_err() {
      return Err(ResponseModel {
        status: ResponseStatus::Error,
        message: format!("Error! Failed to write data to file!"),
        data: DataValue::String("".to_string()),
      });
    }

    return Ok(ResponseModel {
      status: ResponseStatus::Success,
      message: "".to_string(),
      data: DataValue::String(filePath.display().to_string()),
    });
  }

  #[allow(non_snake_case)]
  pub fn openFolderWithFile(&self, path: String) -> Result<ResponseModel, ResponseModel> {
    if let Err(err) = opener::open(path) {
      return Err(ResponseModel {
        status: ResponseStatus::Error,
        message: format!("Failed to open folder:: {}", err),
        data: DataValue::String("".to_string()),
      });
    }

    return Ok(ResponseModel {
      status: ResponseStatus::Success,
      message: "".to_string(),
      data: DataValue::String("".to_string()),
    });
  }

  #[allow(non_snake_case)]
  pub fn openFile(&self, path: String) -> Result<ResponseModel, ResponseModel> {
    if let Err(err) = opener::open(path) {
      return Err(ResponseModel {
        status: ResponseStatus::Error,
        message: format!("Failed to open file:: {}", err),
        data: DataValue::String("".to_string()),
      });
    }

    return Ok(ResponseModel {
      status: ResponseStatus::Success,
      message: "".to_string(),
      data: DataValue::String("".to_string()),
    });
  }
}
