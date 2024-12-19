/* imports */
mod controllers;
mod models;
mod services;
mod helpers;

use controllers::about::{
  download_update,
  get_binary_name_file
};

use controllers::manage_file::{
  choose_file,
  get_data_file_by_path,
  write_data_to_file,
  open_file_in_app
};

use controllers::manage_xls::{
  get_data_file_by_path_xls,
  write_data_to_file_xls
};

use controllers::virus_total::{
  virus_total
};

use controllers::unicode::{
  get_info_symbol
};

use controllers::url_requests::{
  send_request,
  save_data,
  get_data
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_shell::init())
    .invoke_handler(tauri::generate_handler![
      get_binary_name_file,
      download_update,

      choose_file,
      get_data_file_by_path,
      write_data_to_file,
      open_file_in_app,

      get_data_file_by_path_xls,
      write_data_to_file_xls,

      virus_total,

      get_info_symbol,

      send_request,
      save_data,
      get_data,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
