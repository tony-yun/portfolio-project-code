#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(IosNative, NSObject)

RCT_EXTERN_METHOD(exitApp);
RCT_EXTERN_METHOD(setBrightness:(float)val resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(getBrightness:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(hmacSHA256:(NSString *)message key:(NSString *)key resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject);

@end