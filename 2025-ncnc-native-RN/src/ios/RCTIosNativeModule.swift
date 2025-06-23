import UIKit
import React
import CommonCrypto

extension Data {
    init?(hexString: String) {
        self.init(capacity: hexString.count / 2)
        
        var index = hexString.startIndex
        while index < hexString.endIndex {
            let nextIndex = hexString.index(index, offsetBy: 2)
            if let byte = UInt8(hexString[index..<nextIndex], radix: 16) {
                self.append(byte)
            } else {
                return nil
            }
            index = nextIndex
        }
    }
}

@objc(IosNative)
class IosNative: NSObject {
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc(exitApp)
  func exitApp() {
    exit(0)
  }
  
  @objc(setBrightness:resolve:rejecter:)
  func setBrightness(_ val: Float, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      UIScreen.main.brightness = CGFloat(val)
      resolve(true)
    }
  }
  
  @objc(getBrightness:rejecter:)
  func getBrightness(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    resolve(UIScreen.main.brightness)
  }
  
  @objc(hmacSHA256:key:resolver:rejecter:)
  func hmacSHA256(_ message: String, key: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let keyData = Data(hexString: key), let messageData = message.data(using: .utf8) else {
      reject("invalid_input", "Invalid key or message", nil)
      return
    }
    
    var cHMAC = [UInt8](repeating: 0, count: Int(CC_SHA256_DIGEST_LENGTH))
    keyData.withUnsafeBytes { keyBytes in
      messageData.withUnsafeBytes { messageBytes in
        CCHmac(CCHmacAlgorithm(kCCHmacAlgSHA256), keyBytes.baseAddress, keyData.count, messageBytes.baseAddress, messageData.count, &cHMAC)
      }
    }
      
      let hmacData = Data(cHMAC)
      let result = hmacData.map { String(format: "%02hhx", $0) }.joined()
      
      resolve(result)
  }
}
