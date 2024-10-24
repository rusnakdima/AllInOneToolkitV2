/* sys lib */
use chrono::Local;

pub fn get_current_date() -> String {
  let current_datetime = Local::now();
  format!("{}", current_datetime.format("%Y_%m_%d_%H_%M_%S"))
}