/* sys lib */
use tauri::State;

/* models */
use crate::{models::response::ResponseModel, AppState};

#[allow(non_snake_case)]
#[tauri::command]
pub fn chooseFile(
  state: State<'_, AppState>,
  appHandle: tauri::AppHandle,
  typeFile: Vec<&str>,
) -> Result<ResponseModel, ResponseModel> {
  state.manageFileController.chooseFile(appHandle, typeFile)
}

#[allow(non_snake_case)]
#[tauri::command]
pub fn getDataFileByPath(
  state: State<'_, AppState>,
  filePath: String,
) -> Result<ResponseModel, ResponseModel> {
  state.manageFileController.getDataFileByPath(filePath)
}

#[allow(non_snake_case)]
#[tauri::command]
pub fn writeDataToFile(
  state: State<'_, AppState>,
  appHandle: tauri::AppHandle,
  nameFile: String,
  content: String,
  extension: String,
) -> Result<ResponseModel, ResponseModel> {
  state
    .manageFileController
    .writeDataToFile(appHandle, nameFile, content, extension)
}

#[allow(non_snake_case)]
#[tauri::command]
pub fn openFolderWithFile(
  state: State<'_, AppState>,
  path: String,
) -> Result<ResponseModel, ResponseModel> {
  state.manageFileController.openFolderWithFile(path)
}

#[allow(non_snake_case)]
#[tauri::command]
pub fn openFileInApp(
  state: State<'_, AppState>,
  path: String,
) -> Result<ResponseModel, ResponseModel> {
  state.manageFileController.openFileInApp(path)
}
