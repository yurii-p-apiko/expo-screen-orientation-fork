// Copyright 2022-present 650 Industries. All rights reserved.

import SDWebImage
import ExpoModulesCore

enum ImageCachePolicy: String, Enumerable {
  case none
  case disk
  case memory
  case memoryAndDisk

  func toSdCacheType() -> SDImageCacheType {
    switch self {
    case .none:
      return .none
    case .disk:
      return .disk
    case .memory:
      return .memory
    case .memoryAndDisk:
      return .all
    }
  }
}
