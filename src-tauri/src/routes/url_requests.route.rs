/* sys lib */
use tauri::State;

/* models */
use crate::{
  models::{collection_data::CollectionData, request_data::RequestData, response::ResponseModel},
  AppState,
};

#[allow(non_snake_case)]
#[tauri::command]
pub async fn sendRequest(
  state: State<'_, AppState>,
  infoRequest: RequestData,
) -> Result<ResponseModel, ResponseModel> {
  state.urlRequestsController.sendRequest(infoRequest).await
}

#[allow(non_snake_case)]
#[tauri::command]
pub fn saveData(
  state: State<'_, AppState>,
  appHandle: tauri::AppHandle,
  listCollections: Vec<CollectionData>,
) -> Result<ResponseModel, ResponseModel> {
  state
    .urlRequestsController
    .saveData(appHandle, listCollections)
}

#[allow(non_snake_case)]
#[tauri::command]
pub fn getData(
  state: State<'_, AppState>,
  appHandle: tauri::AppHandle,
) -> Result<ResponseModel, ResponseModel> {
  state.urlRequestsController.getData(appHandle)
}
