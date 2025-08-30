/* sys lib */
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ResponseStatus {
  Success,
  Info,
  Warning,
  Error,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum DataValue {
  String(String),
  Number(f64),
  Bool(bool),
  Array(Vec<serde_json::Value>),
  Object(serde_json::Value),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResponseModel {
  pub status: ResponseStatus,
  pub message: String,
  pub data: DataValue,
}
