/* sys lib */
use chrono::Local;
use serde::Serialize;

/* models */
use crate::models::response::DataValue;

pub struct CommonHelper;

impl CommonHelper {
  pub fn new() -> Self {
    Self
  }

  #[allow(non_snake_case)]
  pub fn getCurrentDate(&self) -> String {
    let currentDatetime = Local::now();
    format!("{}", currentDatetime.format("%Y_%m_%d_%H_%M_%S"))
  }

  #[allow(non_snake_case)]
  pub fn convertDataToArray<T: Serialize>(&self, data: &Vec<T>) -> DataValue {
    let serializedArray: Vec<serde_json::Value> = data
      .into_iter()
      .map(|item| serde_json::to_value(item).unwrap())
      .collect();

    DataValue::Array(serializedArray)
  }

  #[allow(non_snake_case)]
  pub fn convertDataToObject<T: Serialize>(&self, data: &T) -> DataValue {
    let serializedObject: serde_json::Value = serde_json::to_value(data).unwrap();

    DataValue::Object(serializedObject)
  }
}
