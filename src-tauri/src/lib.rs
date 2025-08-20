/* imports */
mod controllers;
mod helpers;
mod models;
mod routes;
mod services;

/* sys lib */
use std::sync::Arc;

/* routes */
use routes::{
  about_route::{downloadUpdate, getBinaryNameFile},
  manage_file_route::{
    chooseFile, getDataFileByPath, openFileInApp, openFolderWithFile, writeDataToFile,
  },
  manage_xls_route::{getDataFileByPathXls, writeDataToFileXls},
  unicode_route::getInfoSymbol,
  url_requests_route::{getData, saveData, sendRequest},
  virus_total_route::virusTotal,
};

/* controllers */
use crate::controllers::{
  about_controller::AboutController, manage_file_controller::ManageFileController,
  manage_xls_controller::ManageXlsController, unicode_controller::UnicodeController,
  url_requests_controller::UrlRequestsController, virus_total_controller::VirusTotalController,
};

#[allow(non_snake_case)]
pub struct AppState {
  aboutController: Arc<AboutController>,
  manageFileController: Arc<ManageFileController>,
  manageXlsController: Arc<ManageXlsController>,
  virusTotalController: Arc<VirusTotalController>,
  unicodeController: Arc<UnicodeController>,
  urlRequestsController: Arc<UrlRequestsController>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_http::init())
    .manage(AppState {
      aboutController: Arc::new(AboutController::new()),
      manageFileController: Arc::new(ManageFileController::new()),
      manageXlsController: Arc::new(ManageXlsController::new()),
      virusTotalController: Arc::new(VirusTotalController::new()),
      unicodeController: Arc::new(UnicodeController::new()),
      urlRequestsController: Arc::new(UrlRequestsController::new()),
    })
    .invoke_handler(tauri::generate_handler![
      getBinaryNameFile,
      downloadUpdate,
      chooseFile,
      getDataFileByPath,
      writeDataToFile,
      openFolderWithFile,
      openFileInApp,
      getDataFileByPathXls,
      writeDataToFileXls,
      virusTotal,
      getInfoSymbol,
      getData,
      saveData,
      sendRequest,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
