/* sys lib */
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, PartialEq)]
pub enum TypeRequest {
  GET,
  POST,
  PUT,
  DEL,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RecObj {
  pub key: String,
  pub value: String,
  pub isActive: bool,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type", content = "value")]
pub enum BodyValue {
  String(String),
  Number(f64),
  Bool(bool),
  Array(Vec<serde_json::Value>),
  Object(serde_json::Value),
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BodyData {
  pub key: String,
  pub value: BodyValue,
  pub isActive: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RequestData {
  pub id: String,
  pub title: String,
  pub editTitle: bool,
  pub typeReq: TypeRequest,
  pub url: String,
  pub params: Vec<RecObj>,
  pub headers: Vec<RecObj>,
  pub body: Vec<BodyData>,
}
