/**
 * Created by Weex.
 * Copyright (c) 2016, Alibaba, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache Licence 2.0.
 * For the full copyright and license information,please view the LICENSE file in the root directory of this source tree.
 */

#import "WXEventModule.h"

@implementation WXEventModule

@synthesize weexInstance;

WX_EXPORT_METHOD(@selector(openURL:title:model:));

WX_EXPORT_METHOD(@selector(openController:));

WX_EXPORT_METHOD(@selector(fireNativeGlobalEvent:callback:));

WX_EXPORT_METHOD(@selector(dismissViewController:));

WX_EXPORT_METHOD(@selector(isLoginGlobalEvent:isLogin:));

WX_EXPORT_METHOD(@selector(openWebView:title:));

WX_EXPORT_METHOD(@selector(openLocalWebView:title:));
@end

