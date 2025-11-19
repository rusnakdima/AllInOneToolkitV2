/* imports */
mod controllers;
mod helpers;
mod models;
mod routes;
mod services;

/* sys lib */
use std::sync::Arc;
use tauri::Manager;

/* helpers */
use helpers::config::ConfigHelper;

/* routes */
use routes::{
  about_route::{downloadUpdate, getBinaryNameFile},
  manage_file_route::{
    chooseFile, getDataFileByPath, openFileInApp, openFolderWithFile, writeDataToFile,
  },
  manage_xls_route::{getDataFileByPathXls, writeDataToFileXls},
  math_route::numberIsPrime,
  unicode_route::getInfoSymbol,
  url_requests_route::{getData, saveData, sendRequest},
  virus_total_route::virusTotal,
};

/* controllers */
use crate::controllers::{
  about_controller::AboutController, manage_file_controller::ManageFileController,
  manage_xls_controller::ManageXlsController, math_controller::MathController,
  unicode_controller::UnicodeController, url_requests_controller::UrlRequestsController,
  virus_total_controller::VirusTotalController,
};

#[allow(non_snake_case)]
pub struct AppState {
  aboutController: Arc<AboutController>,
  manageFileController: Arc<ManageFileController>,
  manageXlsController: Arc<ManageXlsController>,
  virusTotalController: Arc<VirusTotalController>,
  unicodeController: Arc<UnicodeController>,
  urlRequestsController: Arc<UrlRequestsController>,
  mathController: Arc<MathController>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[allow(non_snake_case)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_http::init())
    .plugin(tauri_plugin_updater::Builder::new().build())
    .setup(|app| {
      let config = ConfigHelper::new();

      app.manage(AppState {
        aboutController: Arc::new(AboutController::new(config.nameApp.clone())),
        manageFileController: Arc::new(ManageFileController::new(config.appHomeFolder.clone())),
        manageXlsController: Arc::new(ManageXlsController::new(config.appHomeFolder.clone())),
        virusTotalController: Arc::new(VirusTotalController::new()),
        unicodeController: Arc::new(UnicodeController::new()),
        urlRequestsController: Arc::new(UrlRequestsController::new(config.appHomeFolder.clone())),
        mathController: Arc::new(MathController::new()),
      });

      Ok(())
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
      numberIsPrime
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
